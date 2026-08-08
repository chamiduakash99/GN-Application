import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Treecuttingrequest} from '../../../entity/Treecuttingrequest';
import {Treetype} from '../../../entity/Treetype';
import {Treepermissionstatus} from '../../../entity/Treepermissionstatus';
import {Citizen} from '../../../entity/Citizen';
import {Employee} from '../../../entity/employee';

import {TreecuttingrequestService} from '../../../service/TreecuttingrequestService';
import {TreetypeService} from '../../../service/TreetypeService';
import {TreepermissionstatusService} from '../../../service/TreepermissionstatusService';
import {CitizenService} from '../../../service/CitizenService';
import {EmployeeService} from '../../../service/employeeservice';
import {AuthorizationManager} from '../../../service/authorizationmanager';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-treecuttingrequest',
  templateUrl: './treecuttingrequest.component.html',
  styleUrls: ['./treecuttingrequest.component.css']
})
export class TreecuttingrequestComponent implements OnInit {

  // ── Table ──────────────────────────────────────────────────────────────────
  columns: string[]  = ['citizen', 'treetype', 'status', 'requesteddate', 'deedno', 'transport'];
  headers: string[]  = ['Citizen', 'Tree Type', 'Status', 'Requested Date', 'Deed No', 'Transport'];
  binders: string[]  = ['citizen.name', 'treetype.name', 'treepermissionstatus.name', 'requesteddate', 'deedno', 'needstransport'];

  cscolumns: string[] = ['cscitizen', 'cstreetype', 'csstatus', 'csdate', 'csdeed', 'cstransport'];
  csprompts: string[] = ['Search Citizen', 'Search Type', 'Search Status', 'Search Date', 'Search Deed No', 'Transport?'];

  // ── Forms ──────────────────────────────────────────────────────────────────
  cssearch!: FormGroup;
  sssearch!: FormGroup;
  form!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  treecuttingrequest!: Treecuttingrequest;
  oldtreecuttingrequest!: Treecuttingrequest;
  selectedrow: any;

  requests: Treecuttingrequest[] = [];
  data!: MatTableDataSource<Treecuttingrequest>;

  treetypes: Treetype[] = [];
  treepermissionstatuses: Treepermissionstatus[] = [];
  citizens: Citizen[] = [];
  employees: Employee[] = [];
  statusSummary: any[] = [];

  imageurl: string = '';
  permitimageurl: string  = 'assets/default.png';
  transportimageurl: string = 'assets/default.png';
  hasstoredpermit: boolean = false;
  hasstoredtransport: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;

  // ── Button states ──────────────────────────────────────────────────────────
  enaapprove: boolean      = false;
  enareject: boolean       = false;
  enauploadpermit: boolean = false;
  enauploadtransport: boolean = false;

  hasApproveAuthority: boolean = false;
  hasRejectAuthority: boolean = false;
  hasUploadPermitAuthority: boolean = false;
  hasUploadTransportAuthority: boolean = false;

  uiassist: UiAssist;

  constructor(
    private tcrs: TreecuttingrequestService,
    private tts: TreetypeService,
    private tpss: TreepermissionstatusService,
    private cits: CitizenService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    this.cssearch = this.fb.group({
      'cscitizen':   new FormControl(),
      'cstreetype':  new FormControl(),
      'csstatus':    new FormControl(),
      'csdate':      new FormControl(),
      'csdeed':      new FormControl(),
      'cstransport': new FormControl(),
      'csmodi':      new FormControl(),
    });

    this.sssearch = this.fb.group({
      'sscitizens':  new FormControl(),
      'ssstatus':    new FormControl(),
      'sstreetype':  new FormControl(),
      'sstransport': new FormControl(),
    });

    this.form = this.fb.group({
      'citizen':               new FormControl('', [Validators.required]),
      'treetype':              new FormControl('', [Validators.required]),
      'deedno':                new FormControl('', [Validators.required]),
      'treecount':             new FormControl('', [Validators.required]),
      'reasonforcutting':      new FormControl('', [Validators.required]),
      'requesteddate':         new FormControl(''),
      'rejectreason':          new FormControl(''),
      // Transport fields
      'needstransport':        new FormControl(false),
      'destination':           new FormControl(''),
      'vehicletype':           new FormControl(''),
      'vehiclenumber':         new FormControl(''),
      'transportdate':         new FormControl(''),
    }, {updateOn: 'change'});

    Object.keys(this.form.controls).forEach(key => {
      if (key !== 'rejectreason') {
        this.form.get(key)!.disable();
      }
    });

// Watch needstransport toggle
    this.form.get('needstransport')!.valueChanges.subscribe((val: boolean) => {
      this.onTransportToggle(val);
    });
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.imageurl = 'assets/pending.gif';
    this.loadTable('');
    this.tts.getAllList().then(res => this.treetypes = res);
    this.tpss.getAllList().then(res => this.treepermissionstatuses = res);
    this.cits.getAllListNameId().then(res => this.citizens = res);
    this.es.getAllList().then(res => this.employees = res);
    this.loadStatusSummary();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  loadStatusSummary(): void {
    this.tcrs.getStatusSummary()
      .then((data: any[] | undefined) => {
        this.statusSummary = (data || []).map((row: any) => ({
          status: row[0],
          count: row[1]
        }));
      })
      .catch((error: any) => { console.log(error); });
  }

  // ── Transport toggle validators ────────────────────────────────────────────
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
  loadTable(query: string): void {
    this.tcrs.getAll(query)
      .then((items: Treecuttingrequest[]) => {
        this.requests = items;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch(error => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.requests);
        this.data.paginator = this.paginator;
      });
  }

  // ── Table helper ───────────────────────────────────────────────────────────
  getModi(element: Treecuttingrequest): string {
    return element.citizen?.name + ' (' + element.treetype?.name + ')';
  }

  // ── Client-side filter ─────────────────────────────────────────────────────
  filterTable(): void {
    const cs = this.cssearch.getRawValue();
    this.data.filterPredicate = (r: Treecuttingrequest) => {
      return (cs.cscitizen  == null || r.citizen?.name.toLowerCase().includes((cs.cscitizen ?? '').toLowerCase())) &&
        (cs.cstreetype == null || r.treetype?.name.toLowerCase().includes((cs.cstreetype ?? '').toLowerCase())) &&
        (cs.csstatus   == null || r.treepermissionstatus?.name.toLowerCase().includes((cs.csstatus ?? '').toLowerCase())) &&
        (cs.csdate     == null || r.requesteddate?.includes((cs.csdate ?? '').toLowerCase())) &&
        (cs.csdeed     == null || (r.deedno ?? '').toLowerCase().includes((cs.csdeed ?? '').toLowerCase())) &&
        (cs.cstransport == null || String(cs.cstransport).trim() === '' ||
          (r.needstransport ? 'yes required' : 'no not required').includes(String(cs.cstransport).toLowerCase()));
    };
    this.data.filter = 'xx';
  }

  // ── Server-side search ─────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.sssearch.getRawValue();
    let query = '';
    if (ss.sscitizens  != null) query += '&citizenid='              + ss.sscitizens;
    if (ss.ssstatus    != null) query += '&treepermissionstatusid=' + ss.ssstatus;
    if (ss.sstreetype  != null) query += '&treetypeid='             + ss.sstreetype;
    if (ss.sstransport != null) query += '&needstransport='         + ss.sstransport;
    if (query !== '')           query  = query.replace(/^./, '?');
    this.loadTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) { this.sssearch.reset(); this.loadTable(''); }
    });
  }

  // ── Fill form from row ─────────────────────────────────────────────────────
  fillForm(r: Treecuttingrequest): void {
    this.selectedrow          = r;
    this.treecuttingrequest   = JSON.parse(JSON.stringify(r));
    this.oldtreecuttingrequest = JSON.parse(JSON.stringify(r));

    // @ts-ignore
    this.treecuttingrequest.citizen              = (this.citizens ?? []).find(x => x.id === this.treecuttingrequest.citizen.id);
    // @ts-ignore
    this.treecuttingrequest.employee = this.treecuttingrequest.employee
      ? (this.employees ?? []).find(x => x.id === this.treecuttingrequest.employee!.id)
      : undefined;
    // @ts-ignore
    this.treecuttingrequest.treetype             = (this.treetypes ?? []).find(x => x.id === this.treecuttingrequest.treetype.id);
    // @ts-ignore
    this.treecuttingrequest.treepermissionstatus = (this.treepermissionstatuses ?? []).find(x => x.id === this.treecuttingrequest.treepermissionstatus.id);

    this.form.patchValue(this.treecuttingrequest);
    this.form.markAsPristine();

    // Set transport validators based on current value
    this.onTransportToggle(r.needstransport);

    // Set PDF previews
    this.hasstoredpermit    = !!r.haspermitpdf;
    this.hasstoredtransport = !!r.hastransportpdf;
    this.permitimageurl     = 'assets/default.png';
    this.transportimageurl  = 'assets/default.png';

    // Drive button states
    const status = r.treepermissionstatus?.name;
    this.enaapprove        = (status === 'Pending');
    this.enareject         = (status === 'Pending');
    this.enauploadpermit   = (status === 'Approved');
    this.enauploadtransport = (status === 'Approved' || status === 'Permit Issued') && r.needstransport;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasApproveAuthority = authorities.some(authority => authority.module === 'treecuttingrequest' && authority.operation === 'update');
    this.hasRejectAuthority = authorities.some(authority => authority.module === 'treecuttingrequest' && authority.operation === 'update');
    this.hasUploadPermitAuthority = authorities.some(authority => authority.module === 'treecuttingrequest' && authority.operation === 'update');
    this.hasUploadTransportAuthority = authorities.some(authority => authority.module === 'treecuttingrequest' && authority.operation === 'update');
  }

  // ── Errors ─────────────────────────────────────────────────────────────────
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
        this.selectedrow = null;
        this.enaapprove = false; this.enareject = false;
        this.enauploadpermit = false; this.enauploadtransport = false;
        this.permitimageurl = 'assets/default.png';
        this.transportimageurl = 'assets/default.png';
        this.hasstoredpermit = false;
        this.hasstoredtransport = false;
        this.loadTable('');
      }
    });
  }

  // ── Approve ────────────────────────────────────────────────────────────────
  approve(): void {
    if (this.treecuttingrequest.treepermissionstatus?.name !== 'Pending') {
      this.dg.open(MessageComponent, {width: '400px', data: {heading: 'Invalid Action', message: 'Only Pending requests can be approved.'}});
      return;
    }
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Approve', message: 'Are you sure to Approve this Tree Cutting Request?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let appstatus = false; let appmessage = 'Server Not Found';
        this.tcrs.approve(this.treecuttingrequest.id).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            appstatus = response['errors'] == '';
            // @ts-ignore
            if (!appstatus) appmessage = response['errors'];
          } else { appstatus = false; appmessage = 'Content Not Found'; }
        })
        .catch((error: any) => {
          appstatus = false;
          appmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (appstatus) {
            appmessage = 'Request Approved Successfully';
            this.loadTable('');
            this.loadStatusSummary();
            this.enaapprove = false; this.enareject = false;
            this.enauploadpermit = true;
            this.enauploadtransport = this.treecuttingrequest.needstransport;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Approve', message: appmessage}});
        });
      }
    });
  }

  // ── Reject ─────────────────────────────────────────────────────────────────
  reject(): void {
    const rejectReason = this.form.controls['rejectreason'].value;
    if (this.treecuttingrequest.treepermissionstatus?.name !== 'Pending') {
      this.dg.open(MessageComponent, {width: '400px', data: {heading: 'Invalid Action', message: 'Only Pending requests can be rejected.'}});
      return;
    }
    if (!rejectReason || rejectReason.trim() === '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Reject', message: 'Please enter a Reject Reason before rejecting.'}});
      return;
    }
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Reject', message: 'Are you sure to Reject this Request? <br><br>Reason: ' + rejectReason}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let rejstatus = false; let rejmessage = 'Server Not Found';
        this.tcrs.reject(this.treecuttingrequest.id, rejectReason).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            rejstatus = response['errors'] == '';
            // @ts-ignore
            if (!rejstatus) rejmessage = response['errors'];
          } else { rejstatus = false; rejmessage = 'Content Not Found'; }
        })
        .catch((error: any) => {
          rejstatus = false;
          rejmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (rejstatus) {
            rejmessage = 'Request Rejected Successfully';
            this.loadTable('');
            this.loadStatusSummary();
            this.enaapprove = false; this.enareject = false;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Reject', message: rejmessage}});
        });
      }
    });
  }

  // ── Upload permit PDF ──────────────────────────────────────────────────────
  selectPermitPdf(e: any): void {
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => { this.permitimageurl = event.target.result; };
    }
  }

  uploadPermit(): void {
    if (this.permitimageurl === 'assets/default.png') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Upload Permit', message: 'Please select a permit PDF file first.'}});
      return;
    }
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Upload Permit PDF', message: 'Are you sure to Upload the Tree Cutting Permit PDF?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let uplstatus = false; let uplmessage = 'Server Not Found';
        const byteCharacters = atob(this.permitimageurl.split(',')[1]);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) byteArray[i] = byteCharacters.charCodeAt(i);
        this.tcrs.uploadPermit(this.treecuttingrequest.id, byteArray).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            uplstatus = response['errors'] == '';
            // @ts-ignore
            if (!uplstatus) uplmessage = response['errors'];
          } else { uplstatus = false; uplmessage = 'Content Not Found'; }
        })
        .catch((error: any) => {
          uplstatus = false;
          uplmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (uplstatus) {
            uplmessage = 'Permit PDF Uploaded Successfully — Status set to Permit Issued';
            this.loadTable('');
            this.loadStatusSummary();
            this.enauploadpermit = false;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Upload Permit', message: uplmessage}});
        });
      }
    });
  }

  // ── Upload transport PDF ───────────────────────────────────────────────────
  selectTransportPdf(e: any): void {
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => { this.transportimageurl = event.target.result; };
    }
  }

  uploadTransport(): void {
    if (this.transportimageurl === 'assets/default.png') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Upload Transport', message: 'Please select a transport permit PDF file first.'}});
      return;
    }
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Upload Transport PDF', message: 'Are you sure to Upload the Wood Transport Permit PDF?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let uplstatus = false; let uplmessage = 'Server Not Found';
        const byteCharacters = atob(this.transportimageurl.split(',')[1]);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) byteArray[i] = byteCharacters.charCodeAt(i);
        this.tcrs.uploadTransport(this.treecuttingrequest.id, byteArray).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            uplstatus = response['errors'] == '';
            // @ts-ignore
            if (!uplstatus) uplmessage = response['errors'];
          } else { uplstatus = false; uplmessage = 'Content Not Found'; }
        })
        .catch((error: any) => {
          uplstatus = false;
          uplmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (uplstatus) {
            uplmessage = 'Transport Permit PDF Uploaded Successfully';
            this.loadTable('');
            this.enauploadtransport = false;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Upload Transport', message: uplmessage}});
        });
      }
    });
  }

  // ── View stored permit PDFs ────────────────────────────────────────────────
  private openPdf(buffer: ArrayBuffer | undefined, label: string): void {
    if (!buffer) {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: label, message: 'No ' + label + ' stored for this request.'}
      });
      return;
    }
    const b = new Uint8Array(buffer);
    // sniff the magic number so a PNG/JPEG scan opens as an image instead of
    // being forced into Chrome's PDF viewer, which then reports a load failure
    const mime = (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47) ? 'image/png'
               : (b[0] === 0xFF && b[1] === 0xD8) ? 'image/jpeg'
               : 'application/pdf';
    const url = URL.createObjectURL(new Blob([buffer], {type: mime}));
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  downloadPermit(): void {
    this.tcrs.downloadPermitPdf(this.treecuttingrequest.id)
      .then(b => this.openPdf(b, 'Cutting Permit'))
      .catch(() => this.openPdf(undefined, 'Cutting Permit'));
  }

  downloadTransport(): void {
    this.tcrs.downloadTransportPdf(this.treecuttingrequest.id)
      .then(b => this.openPdf(b, 'Transport Permit'))
      .catch(() => this.openPdf(undefined, 'Transport Permit'));
  }

  // ── Template helpers ───────────────────────────────────────────────────────
  get needsTransportChecked(): boolean {
    return this.form.get('needstransport')!.value === true;
  }
}
