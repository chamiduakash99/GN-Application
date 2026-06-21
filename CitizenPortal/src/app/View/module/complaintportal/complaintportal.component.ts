import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

import {Complaint} from '../../entity/Complaint';
import {Complaintstatus} from '../../entity/Complaintstatus';
import {Citizen} from '../../entity/Citizen';
import {Employee} from '../../entity/employee';

import {ComplaintService} from '../../service/ComplaintService';
import {ComplaintStatusService} from '../../service/ComplaintstatusService';
import {CitizenService} from '../../service/CitizenService';
import {EmployeeService} from '../../service/employeeservice';
import {AuthorizationManager} from '../../service/authorizationmanager';

import {UiAssist} from '../../util/ui/ui.assist';
import {MessageComponent} from '../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-citizen-complaint',
    templateUrl: './complaintportal.component.html',
  styleUrls: ['./complaintportal.component.css']
})
export class ComplaintComponent implements OnInit {

  // ── Table ──────────────────────────────────────────────────────────────────
  columns: string[] = ['subject', 'status', 'date', 'referredto', 'actiontaken'];
  headers: string[] = ['Subject', 'Status', 'Date', 'Referred To', 'Action Taken'];
  binders: string[] = ['subject', 'complaintstatus.name', 'complaineddate', 'referredto', 'actiontaken'];

  complaints: Complaint[] = [];
  data!: MatTableDataSource<Complaint>;
  selectedRow: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ── Forms ──────────────────────────────────────────────────────────────────
  form!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  complaint!: Complaint;
  oldcomplaint!: Complaint;

  complaintstatuses: Complaintstatus[] = [];
  citizens: Citizen[] = [];
  employees: Employee[] = [];

  uiassist: UiAssist;

  constructor(
    private cs: ComplaintService,
    private css2: ComplaintStatusService,
    private cits: CitizenService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public auth: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      citizen:         new FormControl('', [Validators.required]),
      employee:        new FormControl('', [Validators.required]),
      subject:         new FormControl('', [Validators.required]),
      description:     new FormControl('', [Validators.required]),
      complaintstatus: new FormControl(''),
      complaineddate:  new FormControl(''),
      rejectreason:    new FormControl(''),
      actiontaken:     new FormControl(''),
      referredto:      new FormControl(''),
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
  loadInitialData() {
    this.css2.getAllList().then(res => this.complaintstatuses = res);
    this.es.getAllList().then((res: Employee[]) => this.employees = res);

    this.cits.getAllListNameId().then((res: Citizen[]) => {
      const citizenString = localStorage.getItem('citizen');
      if (!citizenString) return;
      const citizen = JSON.parse(citizenString);
      // Only show the logged-in citizen in the dropdown
      this.citizens = res.filter((c: Citizen) => c.id === citizen.id);
    });
  }

  loadTable(query: string = '') {
    this.cs.getAll(query)
      .then(res => this.complaints = res)
      .finally(() => {
        this.data = new MatTableDataSource(this.complaints);
        this.data.paginator = this.paginator;
      });
  }

  // ── Fill form from row ────────────────────────────────────────────────────
  fillForm(c: Complaint) {
    this.selectedRow = c;
    this.complaint    = JSON.parse(JSON.stringify(c));
    this.oldcomplaint = JSON.parse(JSON.stringify(c));

    const selectedCitizen = this.citizens.find(x => x.id === this.complaint.citizen?.id);
    const selectedEmployee = this.employees.find(x => x.id === this.complaint.employee?.id);

    this.form.patchValue({
      citizen:         selectedCitizen,
      employee:        selectedEmployee,
      subject:         this.complaint.subject,
      description:     this.complaint.description,
      complaintstatus: this.complaint.complaintstatus?.name,
      complaineddate:  this.complaint.complaineddate,
      rejectreason:    this.complaint.rejectreason,
      actiontaken:     this.complaint.actiontaken,
      referredto:      this.complaint.referredto,
    });
    this.form.markAsPristine();
  }

  // ── Guards ────────────────────────────────────────────────────────────────
  canSubmit(): boolean {
    return this.form.valid && !this.selectedRow;
  }

  canDelete(): boolean {
    if (!this.selectedRow) return false;
    return this.complaint?.complaintstatus?.name === 'Pending';
  }

  // ── Add ───────────────────────────────────────────────────────────────────
  add() {
    if (this.form.invalid) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Validation Error', message: 'Please fill all required fields.'}
      });
      return;
    }

    const raw = this.form.getRawValue();
    const request: Complaint = {
      id: 0,
      citizen:         raw.citizen,
      employee:        raw.employee,
      subject:         raw.subject,
      description:     raw.description,
      complaintstatus: {id: 1, name: 'Pending'} as Complaintstatus,
      complaineddate:  new Date().toISOString(),
      rejectreason:    '',
      actiontaken:     '',
      referredto:      '',
    };

    this.cs.add(request)
      .then(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Success', message: 'Complaint submitted successfully.'}
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
          data: {heading: 'Error', message: 'Failed to submit complaint.'}
        });
      });
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  delete() {
    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {heading: 'Confirm Delete', message: 'Delete this complaint?'}
    }).afterClosed().subscribe(result => {
      if (result) {
        this.cs.delete(this.oldcomplaint.id).then(() => {
          this.clear();
          const citizenString = localStorage.getItem('citizen');
          if (!citizenString) return;
          const citizen = JSON.parse(citizenString);
          this.loadTable('?citizenid=' + citizen.id);
        });
      }
    });
  }

  // ── Clear ─────────────────────────────────────────────────────────────────
  clear() {
    this.form.reset();
    this.selectedRow = null;
  }
}
