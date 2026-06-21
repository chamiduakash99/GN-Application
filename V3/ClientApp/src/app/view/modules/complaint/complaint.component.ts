import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Complaint} from '../../../entity/Complaint';
import {Complaintstatus} from '../../../entity/Complaintstatus';
import {Citizen} from '../../../entity/Citizen';
import {Employee} from '../../../entity/employee';

import {ComplaintService} from '../../../service/ComplaintService';
import {ComplaintStatusService} from '../../../service/ComplaintStatusService';
import {CitizenService} from '../../../service/CitizenService';
import {EmployeeService} from '../../../service/employeeservice';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';
import {AuthorizationManager} from '../../../service/authorizationmanager';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent {

  // ── Table columns ─────────────────────────────────────────────────────────
  columns: string[]  = ['citizen', 'subject', 'status', 'date', 'referredto', 'modi'];
  headers: string[]  = ['Citizen', 'Subject', 'Status', 'Date', 'Referred To', 'Modification'];
  binders: string[]  = ['citizen.name', 'subject', 'complaintstatus.name', 'complaineddate', 'referredto', 'getModi()'];

  cscolumns: string[]  = ['cscitizen', 'cssubject', 'csstatus', 'csdate', 'csreferred', 'csmodi'];
  csprompts: string[]  = ['Search Citizen', 'Search Subject', 'Search Status', 'Search Date', 'Search Referred', 'Search'];

  // ── Forms ─────────────────────────────────────────────────────────────────
  public cssearch!: FormGroup;
  public sssearch!: FormGroup;
  public form!: FormGroup;

  // ── Data ──────────────────────────────────────────────────────────────────
  complaint!: Complaint;
  oldcomplaint!: Complaint;
  selectedrow: any;

  complaints: Array<Complaint> = [];
  data!: MatTableDataSource<Complaint>;

  complaintstatuses: Array<Complaintstatus> = [];
  citizens: Array<Citizen> = [];
  employees: Array<Employee> = [];

  imageurl: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  // ── Button states ─────────────────────────────────────────────────────────
  enaadd: boolean    = false;
  enaupd: boolean    = false;
  enadel: boolean    = false;

  uiassist: UiAssist;

  constructor(
    private cs: ComplaintService,
    private css2: ComplaintStatusService,
    private cits: CitizenService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    // Client-side search form
    this.cssearch = this.fb.group({
      'cscitizen':  new FormControl(),
      'cssubject':  new FormControl(),
      'csstatus':   new FormControl(),
      'csdate':     new FormControl(),
      'csreferred': new FormControl(),
      'csmodi':     new FormControl(),
    });

    // Server-side search form
    this.sssearch = this.fb.group({
      'sscitizens': new FormControl(),
      'ssstatus':   new FormControl(),
      'ssemployee': new FormControl(),
    });

    // Main form
    this.form = this.fb.group({
      'citizen':          new FormControl('', [Validators.required]),
      'employee':         new FormControl('', [Validators.required]),
      'complaintstatus':  new FormControl(''),
      'subject':          new FormControl('', [Validators.required]),
      'description':      new FormControl('', [Validators.required]),
      'complaineddate':   new FormControl(''),
      'rejectreason':     new FormControl(''),
      'actiontaken':      new FormControl(''),
      'referredto':       new FormControl(''),
    }, {updateOn: 'change'});
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable('');

    this.css2.getAllList().then((statuses: Complaintstatus[]) => {
      this.complaintstatuses = statuses;
    });
    this.cits.getAllListNameId().then((citizens: Citizen[]) => {
      this.citizens = citizens;
    });
    this.es.getAllList().then((emps: Employee[]) => {
      this.employees = emps;
    });
  }

  // ── Table loader ──────────────────────────────────────────────────────────
  loadTable(query: string) {
    this.cs.getAll(query)
      .then((items: Complaint[]) => {
        this.complaints = items;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.complaints);
        this.data.paginator = this.paginator;
      });
  }

  // ── Table helper ──────────────────────────────────────────────────────────
  getModi(element: Complaint) {
    return element.citizen?.name + ' (' + element.complaintstatus?.name + ')';
  }

  // ── Client-side filter ────────────────────────────────────────────────────
  filterTable(): void {
    const cs = this.cssearch.getRawValue();
    this.data.filterPredicate = (c: Complaint) => {
      return (cs.cscitizen  == null || c.citizen?.name.toLowerCase().includes(cs.cscitizen)) &&
        (cs.cssubject  == null || c.subject?.toLowerCase().includes(cs.cssubject)) &&
        (cs.csstatus   == null || c.complaintstatus?.name.toLowerCase().includes(cs.csstatus)) &&
        (cs.csdate     == null || c.complaineddate?.includes(cs.csdate)) &&
        (cs.csreferred == null || (c.referredto ?? '').toLowerCase().includes(cs.csreferred));
    };
    this.data.filter = 'xx';
  }

  // ── Server-side search ────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.sssearch.getRawValue();
    let query = '';
    if (ss.sscitizens != null)  query += '&citizenid='          + ss.sscitizens;
    if (ss.ssstatus   != null)  query += '&complaintstatusid='  + ss.ssstatus;
    if (ss.ssemployee != null)  query += '&employeeid='         + ss.ssemployee;
    if (query !== '')           query = query.replace(/^./, '?');
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

  // ── Fill form from row ────────────────────────────────────────────────────
  fillForm(c: Complaint) {
    this.selectedrow = c;
    this.complaint    = JSON.parse(JSON.stringify(c));
    this.oldcomplaint = JSON.parse(JSON.stringify(c));

    // @ts-ignore
    this.complaint.citizen         = this.citizens.find(x => x.id === this.complaint.citizen.id);
    // @ts-ignore
    this.complaint.employee        = this.employees.find(x => x.id === this.complaint.employee.id);
    // @ts-ignore
    this.complaint.complaintstatus = this.complaintstatuses.find(x => x.id === this.complaint.complaintstatus.id);

    this.form.patchValue(this.complaint);
    this.form.markAsPristine();

    const status = c.complaintstatus?.name;
    this.enaadd = false;
    this.enaupd = (status === 'Pending' || status === 'Investigating');
    this.enadel = (status === 'Pending');
  }

  // ── Get errors ────────────────────────────────────────────────────────────
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

  // ── Clear ─────────────────────────────────────────────────────────────────
  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Details?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.selectedrow = null;
        this.enaadd = false;
        this.enaupd = false;
        this.enadel = false;
        this.loadTable('');
      }
    });
  }

  // ── CRUD ──────────────────────────────────────────────────────────────────
  add() {
    let errors = this.getErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Add Complaint', message: 'You have following Errors <br>' + errors}
      });
      return;
    }

    this.complaint = this.form.getRawValue();
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Add Complaint', message: 'Are you sure to Add this Complaint?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let addstatus = false;
        let addmessage = 'Server Not Found';
        this.cs.add(this.complaint).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            addstatus = response['errors'] == '';
            // @ts-ignore
            if (!addstatus) addmessage = response['errors'];
          } else {
            addstatus = false;
            addmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (addstatus) {
            addmessage = 'Complaint Added Successfully';
            this.form.reset();
            this.loadTable('');
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Add Complaint', message: addmessage}
          });
        });
      }
    });
  }

  update() {
    let errors = this.getErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Update Complaint', message: 'You have following Errors <br>' + errors}
      });
      return;
    }

    this.complaint = this.form.getRawValue();
    this.complaint.id = this.oldcomplaint.id;

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Update Complaint', message: 'Are you sure to Update this Complaint?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let updstatus = false;
        let updmessage = 'Server Not Found';
        this.cs.update(this.complaint).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            updstatus = response['errors'] == '';
            // @ts-ignore
            if (!updstatus) updmessage = response['errors'];
          } else {
            updstatus = false;
            updmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (updstatus) {
            updmessage = 'Complaint Updated Successfully';
            this.form.reset();
            this.loadTable('');
            this.enaadd = false;
            this.enaupd = false;
            this.enadel = false;
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Update Complaint', message: updmessage}
          });
        });
      }
    });
  }

  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Delete Complaint', message: 'Are you sure to Delete this Complaint?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus = false;
        let delmessage = 'Server Not Found';
        this.cs.delete(this.oldcomplaint.id).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            delstatus = response['errors'] == '';
            // @ts-ignore
            if (!delstatus) delmessage = response['errors'];
          } else {
            delstatus = false;
            delmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = 'Complaint Deleted Successfully';
            this.form.reset();
            this.loadTable('');
            this.enaadd = false;
            this.enaupd = false;
            this.enadel = false;
          }
          this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Delete Complaint', message: delmessage}
          });
        });
      }
    });
  }
}
