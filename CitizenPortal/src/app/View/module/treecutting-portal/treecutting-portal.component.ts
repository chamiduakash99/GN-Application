import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';

import {Treecuttingrequest} from '../../entity/Treecuttingrequest';
import {Treetype} from '../../entity/Treetype';
import {Treepermissionstatus} from '../../entity/Treepermissionstatus';
import {Citizen} from '../../entity/Citizen';
import {Employee} from '../../entity/employee';

import {TreecuttingrequestService} from '../../service/TreecuttingrequestService';
import {TreetypeService} from '../../service/TreetypeService';
import {TreepermissionstatusService} from '../../service/TreepermissionstatusService';
import {CitizenService} from '../../service/CitizenService';
import {EmployeeService} from '../../service/employeeservice';
import {AuthorizationManager} from '../../service/authorizationmanager';

import {UiAssist} from '../../util/ui/ui.assist';
import {MessageComponent} from '../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../util/dialog/confirm/confirm.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-treecutting-portal',
  templateUrl: './treecutting-portal.component.html',
  styleUrls: ['./treecutting-portal.component.css']
})
export class TreecuttingPortalComponent implements OnInit {

  // ── Table ──────────────────────────────────────────────────────────────────
  // columns: string[] = ['treetype', 'status', 'deedno', 'treecount', 'requesteddate', 'transport'];
  // headers: string[] = ['Tree Type', 'Status', 'Deed No', 'Trees', 'Requested Date', 'Transport'];

  columns: string[] = ['treetype', 'status', 'deedno', 'treecount', 'requesteddate', 'transport', 'downloadpermit', 'downloadtransport'];
  headers: string[] = ['Tree Type', 'Status', 'Deed No', 'Trees', 'Requested Date', 'Transport', 'Permit PDF', 'Transport PDF'];
  binders: string[] = ['treetype.name', 'treepermissionstatus.name', 'deedno', 'treecount', 'requesteddate', 'needstransport'];

  requests: Treecuttingrequest[] = [];
  data!: MatTableDataSource<Treecuttingrequest>;
  selectedRow: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ── Forms ──────────────────────────────────────────────────────────────────
  form!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  treecuttingrequest!: Treecuttingrequest;
  oldtreecuttingrequest!: Treecuttingrequest;

  treetypes: Treetype[] = [];
  treepermissionstatuses: Treepermissionstatus[] = [];
  citizens: Citizen[] = [];
  employees: Employee[] = [];
  minTransportDate = new Date();

  uiassist: UiAssist;

  constructor(
    private tcrs: TreecuttingrequestService,
    private tts: TreetypeService,
    private tpss: TreepermissionstatusService,
    private cits: CitizenService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public auth: AuthorizationManager,
    private datePipe: DatePipe,
  ) {
    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      citizen:              new FormControl('', [Validators.required]),
      treetype:             new FormControl(null, [Validators.required]),
      treepermissionstatus: new FormControl(''),
      deedno:               new FormControl('', [Validators.required, Validators.pattern(/^D\d{3}$/)]),
      treecount:            new FormControl('', [Validators.required]),
      reasonforcutting:     new FormControl('', [Validators.required]),
      requesteddate:        new FormControl(''),
      rejectreason:         new FormControl(''),
      // Transport fields
      needstransport:       new FormControl(false),
      destination:          new FormControl(''),
      vehicletype:          new FormControl(''),
      vehiclenumber:        new FormControl('', [Validators.pattern(/^[A-Z]{2,3}-\d{4}$/)]),
      transportdate:        new FormControl(''),
    });

    // Watch transport toggle
    this.form.get('needstransport')!.valueChanges.subscribe((val: boolean) => {
      this.onTransportToggle(val);
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    const citizenString = localStorage.getItem('citizen');
    if (!citizenString) return;
    const citizen = JSON.parse(citizenString);
    this.loadTable('?citizenid=' + citizen.id);
  }

  // ── Initial data ───────────────────────────────────────────────────────────
  loadInitialData(): void {
    this.tts.getAllList().then(res => this.treetypes = res);
    this.tpss.getAllList().then(res => this.treepermissionstatuses = res);
    this.es.getAllList().then((res: Employee[]) => this.employees = res);

    this.cits.getAllListNameId().then((res: Citizen[]) => {
      const citizenString = localStorage.getItem('citizen');
      if (!citizenString) return;
      const citizen = JSON.parse(citizenString);
      this.citizens = res.filter((c: Citizen) => c.id === citizen.id);
    });
  }

  // ── Transport validators ───────────────────────────────────────────────────
  onTransportToggle(val: boolean): void {
    if (val) {
      this.form.get('destination')!.setValidators([Validators.required]);
      this.form.get('vehicletype')!.setValidators([Validators.required]);
      this.form.get('vehiclenumber')!.setValidators([Validators.required]);
      this.form.get('transportdate')!.setValidators([Validators.required]);
    } else {
      ['destination', 'vehicletype', 'vehiclenumber', 'transportdate'].forEach(f => {
        this.form.get(f)!.clearValidators();
        this.form.get(f)!.reset();
      });
    }
    ['destination', 'vehicletype', 'vehiclenumber', 'transportdate'].forEach(f => {
      this.form.get(f)!.updateValueAndValidity();
    });
  }

  // ── Table loader ───────────────────────────────────────────────────────────
  loadTable(query: string = ''): void {
    this.tcrs.getAll(query)
      .then(res => this.requests = res)
      .finally(() => {
        this.data = new MatTableDataSource(this.requests);
        this.data.paginator = this.paginator;
      });
  }

  // ── Fill form from row ─────────────────────────────────────────────────────
  fillForm(r: Treecuttingrequest): void {
    this.selectedRow           = r;
    this.treecuttingrequest    = JSON.parse(JSON.stringify(r));
    this.oldtreecuttingrequest = JSON.parse(JSON.stringify(r));

    const selectedCitizen  = (this.citizens ?? []).find(x => x.id === this.treecuttingrequest.citizen?.id);
    const selectedEmployee = (this.employees ?? []).find(x => x.id === this.treecuttingrequest.employee?.id);
    const selectedType     = (this.treetypes ?? []).find(x => x.id === this.treecuttingrequest.treetype?.id);

    // Apply transport validators before patching
    this.onTransportToggle(r.needstransport);

    this.form.patchValue({
      citizen:              selectedCitizen,
      employee:             selectedEmployee,
      treetype:             selectedType,
      treepermissionstatus: this.treecuttingrequest.treepermissionstatus?.name,
      deedno:               this.treecuttingrequest.deedno,
      treecount:            this.treecuttingrequest.treecount,
      reasonforcutting:     this.treecuttingrequest.reasonforcutting,
      requesteddate: this.datePipe.transform(this.treecuttingrequest.requesteddate, 'yyyy-MM-dd'),
      rejectreason:         this.treecuttingrequest.rejectreason,
      needstransport:       this.treecuttingrequest.needstransport,
      destination:          this.treecuttingrequest.destination,
      vehicletype:          this.treecuttingrequest.vehicletype,
      vehiclenumber:        this.treecuttingrequest.vehiclenumber,
      transportdate:        this.treecuttingrequest.transportdate,
    });
    this.form.markAsPristine();
  }

  // ── Guards ─────────────────────────────────────────────────────────────────
  canSubmit(): boolean {
    return this.form.valid && !this.selectedRow;
  }

  canDelete(): boolean {
    if (!this.selectedRow) return false;
    return this.treecuttingrequest?.treepermissionstatus?.name === 'Pending';
  }

  canUpdate(): boolean {
    if (!this.selectedRow) return false;
    return this.treecuttingrequest?.treepermissionstatus?.name === 'Pending' && this.form.valid;
  }

  update(): void {
    if (this.form.invalid) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Validation Error', message: 'Please fill all required fields.'}
      });
      return;
    }

    const raw = this.form.getRawValue();
    const request: Treecuttingrequest = {
      ...this.treecuttingrequest,
      treetype:         raw.treetype,
      deedno:           raw.deedno,
      treecount:        raw.treecount,
      reasonforcutting: raw.reasonforcutting,
      needstransport:   raw.needstransport ?? false,
      destination:      raw.needstransport ? raw.destination   : '',
      vehicletype:      raw.needstransport ? raw.vehicletype   : '',
      vehiclenumber:    raw.needstransport ? raw.vehiclenumber : '',
      transportdate:    raw.needstransport ? this.localDate(raw.transportdate) : '',
    };

    this.tcrs.update(request.id, request).then((response) => {
      if (response === undefined) {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Error', message: 'Failed to update request.'}
        });
        return;
      }

      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Success', message: 'Tree Cutting Request updated successfully.'}
      });
      this.clear();
      const citizenString = localStorage.getItem('citizen');
      if (!citizenString) return;
      const citizen = JSON.parse(citizenString);
      this.loadTable('?citizenid=' + citizen.id);
    });
  }

  get needsTransportChecked(): boolean {
    return this.form.get('needstransport')!.value === true;
  }

  get progressIndex(): number {
    const status = this.treecuttingrequest?.treepermissionstatus?.name;
    switch (status) {
      case 'Pending':       return 0;
      case 'Approved':      return 1;
      case 'Permit Issued': return 2;
      default:              return 0;
    }
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
    const request: Treecuttingrequest = {
      id:                   0,
      citizen:              raw.citizen,
      treetype:             raw.treetype,
      treepermissionstatus: {id: 1, name: 'Pending'} as Treepermissionstatus,
      deedno:               raw.deedno,
      treecount:            raw.treecount,
      reasonforcutting:     raw.reasonforcutting,
      requesteddate:        new Date().toISOString(),
      rejectreason:         '',
      permitpdf:            '',
      transportpdf:         '',
      needstransport:       raw.needstransport ?? false,
      destination:          raw.needstransport ? raw.destination  : '',
      vehicletype:          raw.needstransport ? raw.vehicletype  : '',
      vehiclenumber:        raw.needstransport ? raw.vehiclenumber : '',
      transportdate:        raw.needstransport ? this.localDate(raw.transportdate) : '',
    };

    this.tcrs.add(request)
      .then((response: any) => {
        // the server answers 200 with an 'errors' string on validation failure,
        // so a resolved promise is NOT proof the request was accepted
        const serverErrors = response ? response['errors'] : 'Server Not Found';
        if (serverErrors) {
          this.dg.open(MessageComponent, {
            width: '400px',
            data: {heading: 'Could not submit', message: serverErrors}
          });
          return;
        }
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Success', message: 'Tree Cutting Permission Request submitted successfully.'}
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
          data: {heading: 'Error', message: 'Failed to submit request.'}
        });
      });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  delete(): void {
    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {heading: 'Confirm Delete', message: 'Delete this request?'}
    }).afterClosed().subscribe(result => {
      if (result) {
        this.tcrs.delete(this.oldtreecuttingrequest.id).then(() => {
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
  /** yyyy-MM-dd in LOCAL time. toISOString() converts to UTC, which in Sri Lanka
   *  (UTC+5:30) rolls the date back a day - the server then rejects today as past. */
  private localDate(d: any): string {
    if (!d) { return ''; }
    const dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt.getTime())) { return String(d); }
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  }

  clear(): void {
    this.form.reset();
    this.onTransportToggle(false);
    this.selectedRow = null;
  }

  // ── Guards ─────────────────────────────────────────────────────────────────
  canDownloadPermit(req: Treecuttingrequest): boolean {
    return req.treepermissionstatus?.name === 'Permit Issued';
  }

  canDownloadTransport(req: Treecuttingrequest): boolean {
    return req.treepermissionstatus?.name === 'Permit Issued' && !!req.needstransport;
  }

// ── Downloads ────────────────────────────────────────────────────────────
  downloadPermit(req: Treecuttingrequest): void {
    if (!this.canDownloadPermit(req)) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Not Ready', message: 'Permit is not ready for download yet.'}
      });
      return;
    }

    this.tcrs.downloadPermitPdf(req.id).then((buffer: ArrayBuffer | undefined) => {
      if (!buffer) {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Not Available', message: 'Permit file not available. Please contact the GN officer.'}
        });
        return;
      }
      const blob = new Blob([buffer], {type: 'application/pdf'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `permit_${req.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }).catch(() => {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Error', message: 'Permit download failed. Please try again.'}
      });
    });
  }

  downloadTransport(req: Treecuttingrequest): void {
    if (!this.canDownloadTransport(req)) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Not Ready', message: 'Transport permit is not ready for download yet.'}
      });
      return;
    }

    this.tcrs.downloadTransportPdf(req.id).then((buffer: ArrayBuffer | undefined) => {
      if (!buffer) {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Not Available', message: 'Transport permit file not available. Please contact the GN officer.'}
        });
        return;
      }
      const blob = new Blob([buffer], {type: 'application/pdf'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transport_permit_${req.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }).catch(() => {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Error', message: 'Transport permit download failed. Please try again.'}
      });
    });
  }
}
