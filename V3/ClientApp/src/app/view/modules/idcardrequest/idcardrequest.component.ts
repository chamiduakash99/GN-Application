import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Idcardrequest} from '../../../entity/Idcardrequest';
import {Idcardrequeststatus} from '../../../entity/Idcardrequeststatus';
import {Reason} from '../../../entity/Reason';
import {Citizen} from '../../../entity/Citizen';
import {Employee} from '../../../entity/employee';

import {IdcardrequestService} from '../../../service/IdcardrequestService';
import {IdcardrequeststatusService} from '../../../service/IdcardrequeststatusService';
import {ReasonService} from '../../../service/ReasonService';
import {CitizenService} from '../../../service/CitizenService';
import {EmployeeService} from '../../../service/employeeservice';
import {AuthorizationManager} from '../../../service/authorizationmanager';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-idcardrequest',
  templateUrl: './idcardrequest.component.html',
  styleUrls: ['./idcardrequest.component.css']
})
export class IdcardrequestComponent implements OnInit {

  // ── Table ──────────────────────────────────────────────────────────────────
  columns: string[]  = ['citizen', 'reason', 'status', 'applieddate', 'bcnooridno', 'modi'];
  headers: string[]  = ['Citizen', 'Reason', 'Status', 'Applied Date', 'BC/ID No', 'Modification'];
  binders: string[]  = ['citizen.name', 'reason.name', 'idcardrequeststatus.name', 'applieddate', 'bcnooridno', 'getModi()'];

  cscolumns: string[] = ['cscitizen', 'csreason', 'csstatus', 'csdate', 'csbcno', 'csmodi'];
  csprompts: string[] = ['Search Citizen', 'Search Reason', 'Search Status', 'Search Date', 'Search BC/ID No', 'Search'];

  // ── Forms ──────────────────────────────────────────────────────────────────
  cssearch!: FormGroup;
  sssearch!: FormGroup;
  form!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  idcardrequest!: Idcardrequest;
  oldidcardrequest!: Idcardrequest;
  selectedrow: any;

  idcardrequests: Idcardrequest[] = [];
  data!: MatTableDataSource<Idcardrequest>;

  idcardrequeststatus: Idcardrequeststatus[] = [];
  reasons: Reason[] = [];
  citizens: Citizen[] = [];
  employees: Employee[] = [];

  imageurl: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  // ── Button states ──────────────────────────────────────────────────────────
  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  uiassist: UiAssist;

  // Track selected reason to drive conditional validation
  selectedReasonId: number = 0;

  constructor(
    private irs: IdcardrequestService,
    private irss: IdcardrequeststatusService,
    private rs: ReasonService,
    private cits: CitizenService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    this.cssearch = this.fb.group({
      'cscitizen': new FormControl(),
      'csreason':  new FormControl(),
      'csstatus':  new FormControl(),
      'csdate':    new FormControl(),
      'csbcno':    new FormControl(),
      'csmodi':    new FormControl(),
    });

    this.sssearch = this.fb.group({
      'sscitizens': new FormControl(),
      'ssstatus':   new FormControl(),
      'ssreason':   new FormControl(),
    });

    this.form = this.fb.group({
      'citizen':               new FormControl('', [Validators.required]),
      'employee':              new FormControl('', [Validators.required]),
      'reason':                new FormControl('', [Validators.required]),
      'idcardrequeststatus':   new FormControl(''),
      'bcnooridno':            new FormControl(''),
      'applieddate':           new FormControl(''),
      'complaintdate':         new FormControl(''),
      'complaintpolicestation':new FormControl(''),
      'complaintno':           new FormControl(''),
      'rejectreason':          new FormControl(''),
    }, {updateOn: 'change'});

    // Watch reason changes to update validators dynamically
    this.form.get('reason')!.valueChanges.subscribe((reason: Reason) => {
      this.onReasonChange(reason);
    });
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable('');

    this.irss.getAllList().then(res => this.idcardrequeststatus = res);
    this.rs.getAllList().then(res => this.reasons = res);
    this.cits.getAllListNameId().then(res => this.citizens = res);
    this.es.getAllList().then(res => this.employees = res);

    // Start with no fields required until reason is chosen
    this.clearConditionalValidators();
  }

  // ── Reason-driven conditional validators ──────────────────────────────────
  onReasonChange(reason: Reason): void {
    if (!reason) return;
    this.selectedReasonId = reason.id;

    if (reason.id === 1) {
      // First time — only BC/ID number required
      this.setFirstTimeValidators();
    } else {
      // Misplaced (2) or Damaged (3) — police complaint fields required
      this.setPoliceComplaintValidators();
    }
  }

  setFirstTimeValidators(): void {
    // bcnooridno required, police fields cleared and disabled
    this.form.get('bcnooridno')!.setValidators([Validators.required]);
    this.form.get('bcnooridno')!.enable();

    this.form.get('complaintdate')!.clearValidators();
    this.form.get('complaintpolicestation')!.clearValidators();
    this.form.get('complaintno')!.clearValidators();

    this.form.get('complaintdate')!.disable();
    this.form.get('complaintpolicestation')!.disable();
    this.form.get('complaintno')!.disable();

    this.form.get('complaintdate')!.reset();
    this.form.get('complaintpolicestation')!.reset();
    this.form.get('complaintno')!.reset();

    this.updateValueAndValidity();
  }

  setPoliceComplaintValidators(): void {
    // Police fields required, bcnooridno cleared and disabled
    this.form.get('complaintdate')!.setValidators([Validators.required]);
    this.form.get('complaintpolicestation')!.setValidators([Validators.required]);
    this.form.get('complaintno')!.setValidators([Validators.required]);

    this.form.get('complaintdate')!.enable();
    this.form.get('complaintpolicestation')!.enable();
    this.form.get('complaintno')!.enable();

    this.form.get('bcnooridno')!.clearValidators();
    this.form.get('bcnooridno')!.disable();
    this.form.get('bcnooridno')!.reset();

    this.updateValueAndValidity();
  }

  clearConditionalValidators(): void {
    ['bcnooridno', 'complaintdate', 'complaintpolicestation', 'complaintno'].forEach(f => {
      this.form.get(f)!.clearValidators();
      this.form.get(f)!.disable();
      this.form.get(f)!.updateValueAndValidity();
    });
  }

  updateValueAndValidity(): void {
    ['bcnooridno', 'complaintdate', 'complaintpolicestation', 'complaintno'].forEach(f => {
      this.form.get(f)!.updateValueAndValidity();
    });
  }

  // ── Table loader ───────────────────────────────────────────────────────────
  loadTable(query: string) {
    this.irs.getAll(query)
      .then((items: Idcardrequest[]) => {
        this.idcardrequests = items;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch(error => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.idcardrequests);
        this.data.paginator = this.paginator;
      });
  }

  // ── Table helper ───────────────────────────────────────────────────────────
  getModi(element: Idcardrequest): string {
    return element.citizen?.name + ' (' + element.reason?.name + ')';
  }

  // ── Client-side filter ─────────────────────────────────────────────────────
  filterTable(): void {
    const cs = this.cssearch.getRawValue();
    this.data.filterPredicate = (r: Idcardrequest) => {
      return (cs.cscitizen == null || r.citizen?.name.toLowerCase().includes(cs.cscitizen)) &&
        (cs.csreason  == null || r.reason?.name.toLowerCase().includes(cs.csreason)) &&
        (cs.csstatus  == null || r.idcardrequeststatus?.name.toLowerCase().includes(cs.csstatus)) &&
        (cs.csdate    == null || r.applieddate?.includes(cs.csdate)) &&
        (cs.csbcno    == null || (r.bcnooridno ?? '').toLowerCase().includes(cs.csbcno));
    };
    this.data.filter = 'xx';
  }

  // ── Server-side search ─────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.sssearch.getRawValue();
    let query = '';
    if (ss.sscitizens != null) query += '&citizenid='              + ss.sscitizens;
    if (ss.ssstatus   != null) query += '&idcardrequeststatusid='  + ss.ssstatus;
    if (ss.ssreason   != null) query += '&reasonid='               + ss.ssreason;
    if (query !== '')          query = query.replace(/^./, '?');
    this.loadTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.sssearch.reset();
        this.loadTable('');
      }
    });
  }

  // ── Fill form from row ─────────────────────────────────────────────────────
  fillForm(r: Idcardrequest): void {
    this.selectedrow      = r;
    this.idcardrequest    = JSON.parse(JSON.stringify(r));
    this.oldidcardrequest = JSON.parse(JSON.stringify(r));

    // @ts-ignore
    this.idcardrequest.citizen           = this.citizens.find(x => x.id === this.idcardrequest.citizen.id);
    // @ts-ignore
    this.idcardrequest.employee          = this.employees.find(x => x.id === this.idcardrequest.employee.id);
    // @ts-ignore
    this.idcardrequest.reason            = this.reasons.find(x => x.id === this.idcardrequest.reason.id);
    // @ts-ignore
    this.idcardrequest.idcardrequeststatus = this.idcardrequeststatus.find(x => x.id === this.idcardrequest.idcardrequeststatus.id);

    // Apply validators before patching so fields enable/disable correctly
    this.onReasonChange(this.idcardrequest.reason);

    this.form.patchValue(this.idcardrequest);
    this.form.markAsPristine();

    const status = r.idcardrequeststatus?.name;
    this.enaadd = false;
    this.enaupd = (status === 'Pending');
    this.enadel = (status === 'Pending');
  }

  // ── Validation helper ──────────────────────────────────────────────────────
  getErrors(): string {
    let errors = '';
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) {
        errors += '<br>Invalid ' + controlName.charAt(0).toUpperCase() + controlName.slice(1);
      }
    }
    return errors;
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Details?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.clearConditionalValidators();
        this.selectedrow = null;
        this.enaadd = false;
        this.enaupd = false;
        this.enadel = false;
        this.loadTable('');
      }
    });
  }

  // ── Add ────────────────────────────────────────────────────────────────────
  add(): void {
    let errors = this.getErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Add Request', message: 'You have following Errors <br>' + errors}
      });
      return;
    }

    this.idcardrequest = this.form.getRawValue();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Add ID Card Request', message: 'Are you sure to Add this ID Card Request?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let addstatus = false;
        let addmessage = 'Server Not Found';
        this.irs.add(this.idcardrequest).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            addstatus = response['errors'] == '';
            // @ts-ignore
            if (!addstatus) addmessage = response['errors'];
          } else {
            addstatus = false; addmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (addstatus) {
            addmessage = 'ID Card Request Added Successfully';
            this.form.reset();
            this.clearConditionalValidators();
            this.loadTable('');
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Add ID Card Request', message: addmessage}
          });
        });
      }
    });
  }

  // ── Update ─────────────────────────────────────────────────────────────────
  update(): void {
    let errors = this.getErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Update Request', message: 'You have following Errors <br>' + errors}
      });
      return;
    }

    this.idcardrequest = this.form.getRawValue();
    this.idcardrequest.id = this.oldidcardrequest.id;

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Update ID Card Request', message: 'Are you sure to Update this ID Card Request?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let updstatus = false;
        let updmessage = 'Server Not Found';
        this.irs.update(this.idcardrequest).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            updstatus = response['errors'] == '';
            // @ts-ignore
            if (!updstatus) updmessage = response['errors'];
          } else {
            updstatus = false; updmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (updstatus) {
            updmessage = 'ID Card Request Updated Successfully';
            this.form.reset();
            this.clearConditionalValidators();
            this.loadTable('');
            this.enaadd = false; this.enaupd = false; this.enadel = false;
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Update ID Card Request', message: updmessage}
          });
        });
      }
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  delete(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Delete ID Card Request', message: 'Are you sure to Delete this ID Card Request?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus = false;
        let delmessage = 'Server Not Found';
        this.irs.delete(this.oldidcardrequest.id).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            delstatus = response['errors'] == '';
            // @ts-ignore
            if (!delstatus) delmessage = response['errors'];
          } else {
            delstatus = false; delmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = 'ID Card Request Deleted Successfully';
            this.form.reset();
            this.clearConditionalValidators();
            this.loadTable('');
            this.enaadd = false; this.enaupd = false; this.enadel = false;
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Delete ID Card Request', message: delmessage}
          });
        });
      }
    });
  }

  // ── Helpers for template ───────────────────────────────────────────────────
  get isFirstTime(): boolean {
    return this.selectedReasonId === 1;
  }

  get isPoliceRequired(): boolean {
    return this.selectedReasonId === 2 || this.selectedReasonId === 3;
  }
}
