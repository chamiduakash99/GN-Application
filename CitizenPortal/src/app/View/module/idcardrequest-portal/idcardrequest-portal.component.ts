import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

import {Idcardrequest} from '../../entity/Idcardrequest';
import {Idcardrequeststatus} from '../../entity/Idcardrequeststatus';
import {Reason} from '../../entity/Reason';
import {Citizen} from '../../entity/Citizen';
import {Employee} from '../../entity/employee';

import {IdcardrequestService} from '../../service/IdcardrequestService';
import {IdcardrequeststatusService} from '../../service/IdcardrequeststatusService';
import {ReasonService} from '../../service/ReasonService';
import {CitizenService} from '../../service/CitizenService';
import {EmployeeService} from '../../service/employeeservice';
import {AuthorizationManager} from '../../service/authorizationmanager';

import {UiAssist} from '../../util/ui/ui.assist';
import {MessageComponent} from '../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-idcardrequest-portal',
  templateUrl: './idcardrequest-portal.component.html',
  styleUrls: ['./idcardrequest-portal.component.css']
})
export class IdcardrequestPortalComponent implements OnInit {

  // ── Table ──────────────────────────────────────────────────────────────────
  columns: string[] = ['reason', 'status', 'applieddate', 'bcnooridno', 'complaintno'];
  headers: string[] = ['Reason', 'Status', 'Applied Date', 'BC/ID No', 'Complaint No'];
  binders: string[] = ['reason.name', 'idcardrequeststatus.name', 'applieddate', 'bcnooridno', 'complaintno'];

  idcardrequests: Idcardrequest[] = [];
  data!: MatTableDataSource<Idcardrequest>;
  selectedRow: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ── Forms ──────────────────────────────────────────────────────────────────
  form!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  idcardrequest!: Idcardrequest;
  oldidcardrequest!: Idcardrequest;

  idcardrequeststatus: Idcardrequeststatus[] = [];
  reasons: Reason[] = [];
  citizens: Citizen[] = [];
  employees: Employee[] = [];

  selectedReasonId: number = 0;

  uiassist: UiAssist;

  constructor(
    private irs: IdcardrequestService,
    private irss: IdcardrequeststatusService,
    private rs: ReasonService,
    private cits: CitizenService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public auth: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      citizen:               new FormControl('', [Validators.required]),
      employee:              new FormControl('', [Validators.required]),
      reason:                new FormControl('', [Validators.required]),
      idcardrequeststatus:   new FormControl(''),
      bcnooridno:            new FormControl(''),
      applieddate:           new FormControl(''),
      complaintdate:         new FormControl(''),
      complaintpolicestation:new FormControl(''),
      complaintno:           new FormControl(''),
      rejectreason:          new FormControl(''),
    });

    // Watch reason to toggle fields
    this.form.get('reason')!.valueChanges.subscribe((reason: Reason) => {
      this.onReasonChange(reason);
    });
  }

  ngOnInit(): void {
    this.loadInitialData();

    const citizenString = localStorage.getItem('citizen');
    if (!citizenString) return;
    const citizen = JSON.parse(citizenString);
    this.loadTable('?citizenid=' + citizen.id);
  }

  // ── Data loaders ───────────────────────────────────────────────────────────
  loadInitialData(): void {
    this.irss.getAllList().then(res => this.idcardrequeststatus = res);
    this.rs.getAllList().then(res => this.reasons = res);
    this.es.getAllList().then((res: Employee[]) => this.employees = res);

    this.cits.getAllListNameId().then((res: Citizen[]) => {
      const citizenString = localStorage.getItem('citizen');
      if (!citizenString) return;
      const citizen = JSON.parse(citizenString);
      // Only the logged-in citizen
      this.citizens = res.filter((c: Citizen) => c.id === citizen.id);
    });
  }

  loadTable(query: string = ''): void {
    this.irs.getAll(query)
      .then(res => this.idcardrequests = res)
      .finally(() => {
        this.data = new MatTableDataSource(this.idcardrequests);
        this.data.paginator = this.paginator;
      });
  }

  // ── Reason-driven validators ───────────────────────────────────────────────
  onReasonChange(reason: Reason): void {
    if (!reason) return;
    this.selectedReasonId = reason.id;

    if (reason.id === 1) {
      this.setFirstTimeValidators();
    } else {
      this.setPoliceComplaintValidators();
    }
  }

  setFirstTimeValidators(): void {
    this.form.get('bcnooridno')!.setValidators([Validators.required]);
    this.form.get('bcnooridno')!.enable();

    ['complaintdate', 'complaintpolicestation', 'complaintno'].forEach(f => {
      this.form.get(f)!.clearValidators();
      this.form.get(f)!.disable();
      this.form.get(f)!.reset();
    });
    this.updateValueAndValidity();
  }

  setPoliceComplaintValidators(): void {
    this.form.get('complaintdate')!.setValidators([Validators.required]);
    this.form.get('complaintpolicestation')!.setValidators([Validators.required]);
    this.form.get('complaintno')!.setValidators([Validators.required]);

    ['complaintdate', 'complaintpolicestation', 'complaintno'].forEach(f => {
      this.form.get(f)!.enable();
    });

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
    this.selectedReasonId = 0;
  }

  updateValueAndValidity(): void {
    ['bcnooridno', 'complaintdate', 'complaintpolicestation', 'complaintno'].forEach(f => {
      this.form.get(f)!.updateValueAndValidity();
    });
  }

  // ── Fill form from row ─────────────────────────────────────────────────────
  fillForm(r: Idcardrequest): void {
    this.selectedRow      = r;
    this.idcardrequest    = JSON.parse(JSON.stringify(r));
    this.oldidcardrequest = JSON.parse(JSON.stringify(r));

    const selectedCitizen  = this.citizens.find(x => x.id === this.idcardrequest.citizen?.id);
    const selectedEmployee = this.employees.find(x => x.id === this.idcardrequest.employee?.id);
    const selectedReason   = this.reasons.find(x => x.id === this.idcardrequest.reason?.id);

    // Set validators before patching so fields are enabled correctly
    if (selectedReason) this.onReasonChange(selectedReason);

    this.form.patchValue({
      citizen:                selectedCitizen,
      employee:               selectedEmployee,
      reason:                 selectedReason,
      idcardrequeststatus:    this.idcardrequest.idcardrequeststatus?.name,
      bcnooridno:             this.idcardrequest.bcnooridno,
      applieddate:            this.idcardrequest.applieddate,
      complaintdate:          this.idcardrequest.complaintdate,
      complaintpolicestation: this.idcardrequest.complaintpolicestation,
      complaintno:            this.idcardrequest.complaintno,
      rejectreason:           this.idcardrequest.rejectreason,
    });
    this.form.markAsPristine();
  }

  // ── Guards ─────────────────────────────────────────────────────────────────
  canSubmit(): boolean {
    return this.form.valid && !this.selectedRow;
  }

  canDelete(): boolean {
    if (!this.selectedRow) return false;
    return this.idcardrequest?.idcardrequeststatus?.name === 'Pending';
  }

  // ── Add ────────────────────────────────────────────────────────────────────
  add(): void {
    if (this.form.invalid) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Validation Error', message: 'Please fill all required fields.'}
      });
      return;
    }

    const raw = this.form.getRawValue();
    const request: Idcardrequest = {
      id:                     0,
      citizen:                raw.citizen,
      employee:               raw.employee,
      reason:                 raw.reason,
      idcardrequeststatus:    {id: 1, name: 'Pending'} as Idcardrequeststatus,
      bcnooridno:             raw.bcnooridno ?? '',
      applieddate:            new Date().toISOString(),
      complaintdate:          raw.complaintdate ?? '',
      complaintpolicestation: raw.complaintpolicestation ?? '',
      complaintno:            raw.complaintno ?? '',
      rejectreason:           '',
    };

    this.irs.add(request)
      .then(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Success', message: 'ID Card Request submitted successfully.'}
        });
        this.clear();
        const citizenString = localStorage.getItem('citizen');
        if (!citizenString) return;
        const citizen = JSON.parse(citizenString);
        this.loadTable('?citizenid=' + citizen.id);
      })
      .catch(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Error', message: 'Failed to submit ID Card Request.'}
        });
      });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  delete(): void {
    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {heading: 'Confirm Delete', message: 'Delete this ID Card Request?'}
    }).afterClosed().subscribe(result => {
      if (result) {
        this.irs.delete(this.oldidcardrequest.id).then(() => {
          this.clear();
          const citizenString = localStorage.getItem('citizen');
          if (!citizenString) return;
          const citizen = JSON.parse(citizenString);
          this.loadTable('?citizenid=' + citizen.id);
        });
      }
    });
  }

  // ── Clear ──────────────────────────────────────────────────────────────────
  clear(): void {
    this.form.reset();
    this.clearConditionalValidators();
    this.selectedRow = null;
  }

  // ── Template helpers ───────────────────────────────────────────────────────
  get isFirstTime(): boolean {
    return this.selectedReasonId === 1;
  }

  get isPoliceRequired(): boolean {
    return this.selectedReasonId === 2 || this.selectedReasonId === 3;
  }

  get progressIndex(): number {
    const status = this.idcardrequest?.idcardrequeststatus?.name;
    switch (status) {
      case 'Pending':              return 0;
      case 'Approved':             return 1;
      case 'Send to Authorities':  return 2;
      default:                     return 0;
    }
  }
}
