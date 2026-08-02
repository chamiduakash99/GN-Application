import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Certificaterequest} from '../../../entity/certificaterequest';
import {Certificatetype} from '../../../entity/Certificatetype';
import {Requeststatus} from '../../../entity/Requeststatus';
import {CertificaterequestService} from '../../../service/certificaterequestservice';
import {CertificateTypeService} from '../../../service/certificatetypeservice';
import {RequestStatusService} from '../../../service/requeststatusservice';
import {CitizenService} from '../../../service/CitizenService';
import {Citizen} from '../../../entity/Citizen';
import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';
import {AuthorizationManager} from '../../../service/authorizationmanager';


@Component({
  selector: 'app-certificaterequest',
  templateUrl: './certificaterequest.component.html',
  styleUrls: ['./certificaterequest.component.css']
})
export class CertificaterequestComponent implements OnInit {
  // ── Request table ─────────────────────────────────────────────────────────
  reqcolumns: string[] = ['citizen', 'certificateType', 'requestStatus', 'requestedDate', 'purpose'];
  reqheaders: string[] = ['Citizen', 'Type', 'Status', 'Requested Date', 'Purpose'];
  reqbinders: string[] = ['citizen.name', 'certificatetype.name', 'requeststatus.name', 'requesteddate', 'purpose'];
  csreqcolumns: string[] = ['cscitizen', 'cstype', 'csstatus', 'csdate', 'cspurpose'];
  csreqprompts: string[] = ['Search Citizen', 'Search Type', 'Search Status', 'Search Date', 'Search Purpose'];

  // ── Forms ─────────────────────────────────────────────────────────────────
  csreqsearch!: FormGroup;
  ssreqsearch!: FormGroup;
  reqform!: FormGroup;

  // ── Data ──────────────────────────────────────────────────────────────────
  certificaterequest: Certificaterequest = {} as Certificaterequest;
  oldcertificaterequest: Certificaterequest = {} as Certificaterequest;
  selectedreqrow: any;
  certificaterequests: Array<Certificaterequest> = [];
  reqdata!: MatTableDataSource<Certificaterequest>;
  certificatetypes: Array<Certificatetype> = [];
  requeststatuses: Array<Requeststatus> = [];
  citizens: Array<Citizen> = [];
  statusSummary: any[] = [];
  imageurl: string = '';

  @ViewChild('reqpaginator') reqpaginator!: MatPaginator;

  // ── Button states ─────────────────────────────────────────────────────────
  enaapprove: boolean = false;
  enareject: boolean = false;

  hasApproveAuthority: boolean = false;
  hasRejectAuthority: boolean = false;


  uiassist: UiAssist;

  constructor(
    private crs: CertificaterequestService,
    private cts: CertificateTypeService,
    private rss: RequestStatusService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
    private cs2: CitizenService,
  ) {
    this.uiassist = new UiAssist(this);

    this.csreqsearch = this.fb.group({
      'cscitizen': new FormControl(),
      'cstype': new FormControl(),
      'csstatus': new FormControl(),
      'csdate': new FormControl(),
      'cspurpose': new FormControl(),
      'csmodi': new FormControl(),
    });

    this.ssreqsearch = this.fb.group({
      'sscitizens': new FormControl(),
      'sstype': new FormControl(),
      'ssstatus': new FormControl(),
    });

    this.reqform = this.fb.group({
      'citizen': new FormControl('', [Validators.required]),
      'certificatetype': new FormControl('', [Validators.required]),
      'purpose': new FormControl('', [Validators.required]),
      'rejectreason': new FormControl(''),
      'requeststatus': new FormControl(''),
      'requesteddate': new FormControl(''),
      'updateddate': new FormControl(''),
    }, {updateOn: 'change'});
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();
    this.cts.getAllList().then((types: Certificatetype[]) => {
      this.certificatetypes = types;
    });
    this.rss.getAllList().then((statuses: Requeststatus[]) => {
      this.requeststatuses = statuses;
    });
    this.cs2.getAllListNameId().then((citizens: Citizen[]) => {
      this.citizens = citizens;
    });
    this.loadStatusSummary();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }


  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadRequestTable('');
  }

  // ── Table loader ──────────────────────────────────────────────────────────
  loadRequestTable(query: string) {
    this.crs.getAll(query)
      .then((reqs: Certificaterequest[]) => {
        this.certificaterequests = reqs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error: any) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.reqdata = new MatTableDataSource(this.certificaterequests);
        this.reqdata.paginator = this.reqpaginator;
      });
  }

  loadStatusSummary() {
    this.crs.getStatusSummary()
      .then((data: any[] | undefined) => {
        this.statusSummary = (data || []).map((row: any) => ({
          status: row[0],
          count: row[1]
        }));
      })
      .catch((error: any) => { console.log(error); });
  }
  // loadStatusSummary() {
  //   this.crs.getStatusSummary()
  //     .then((data: any) => { this.statusSummary = data; })
  //     .catch((error: any) => { console.log(error); });
  // }

  // ── Button state helpers ──────────────────────────────────────────────────
  enableApproveReject(approve: boolean, reject: boolean): void {
    this.enaapprove = approve;
    this.enareject = reject;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasApproveAuthority = authorities.some(authority => authority.module === 'certificaterequest' && authority.operation === 'update');
    this.hasRejectAuthority = authorities.some(authority => authority.module === 'certificaterequest' && authority.operation === 'update');
  }

  // ── Table helper ──────────────────────────────────────────────────────────
  getModi(element: Certificaterequest) {
    return element.citizen?.name + ' (' + element.certificatetype?.name + ')';
  }

  // ── Client-side filter ────────────────────────────────────────────────────
  filterRequestTable(): void {
    const cs = this.csreqsearch.getRawValue();
    this.reqdata.filterPredicate = (req: Certificaterequest, filter: string) => {
      return (cs.cscitizen == null || req.citizen?.name.toLowerCase().includes(cs.cscitizen)) &&
        (cs.cstype == null || req.certificatetype?.name.toLowerCase().includes(cs.cstype)) &&
        (cs.csstatus == null || req.requeststatus?.name.toLowerCase().includes(cs.csstatus)) &&
        (cs.csdate == null || req.requesteddate?.includes(cs.csdate)) &&
        (cs.cspurpose == null || req.purpose?.toLowerCase().includes(cs.cspurpose));
    };
    this.reqdata.filter = 'xx';
  }

  // ── Server-side search ────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.ssreqsearch.getRawValue();
    let query = '';
    if (ss.sscitizens != null) query += '&citizenid=' + ss.sscitizens;
    if (ss.sstype != null) query += '&certificatetypeid=' + ss.sstype;
    if (ss.ssstatus != null) query += '&requeststatusid=' + ss.ssstatus;
    if (query != '') query = query.replace(/^./, '?');
    this.loadRequestTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        this.ssreqsearch.reset();
        this.loadRequestTable('');
      }
    });
  }

  // ── Fill form from request table row ─────────────────────────────────────
  fillReqForm(req: Certificaterequest) {
    const status = req.requeststatus?.name;
    this.enableApproveReject(status === 'Pending', status === 'Pending');
    this.selectedreqrow = req;
    this.certificaterequest = JSON.parse(JSON.stringify(req));
    this.oldcertificaterequest = JSON.parse(JSON.stringify(req));
    // @ts-ignore
    this.certificaterequest.citizen = this.citizens.find(c => c.id === this.certificaterequest.citizen.id);
    // @ts-ignore
    this.certificaterequest.certificatetype = this.certificatetypes.find(t => t.id === this.certificaterequest.certificatetype.id);
    // @ts-ignore
    this.certificaterequest.requeststatus = this.requeststatuses.find(s => s.id === this.certificaterequest.requeststatus.id);
    this.reqform.patchValue(this.certificaterequest);
    this.reqform.markAsPristine();
  }

  // ── Validation helpers ────────────────────────────────────────────────────
  getReqUpdates(): string {
    let updates = '';
    for (const controlName in this.reqform.controls) {
      if (this.reqform.controls[controlName].dirty)
        updates += '<br>' + controlName.charAt(0).toUpperCase() + controlName.slice(1) + ' Changed';
    }
    return updates;
  }

  getReqErrors(): string {
    let errors = '';
    for (const controlName in this.reqform.controls) {
      if (this.reqform.controls[controlName].errors)
        errors += '<br>Invalid ' + controlName.charAt(0).toUpperCase() + controlName.slice(1);
    }
    return errors;
  }

  // ── Clear form ────────────────────────────────────────────────────────────
  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Details?'}
    });
    confirm.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        this.reqform.reset();
        this.selectedreqrow = null;
        this.enableApproveReject(false, false);
        this.loadRequestTable('');
      }
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // APPROVE
  // ════════════════════════════════════════════════════════════════════════════
  approve() {
    if (this.certificaterequest.requeststatus?.name !== 'Pending') {
      this.dg.open(MessageComponent, {
        width: '400px', data: {heading: 'Invalid Action', message: 'Only Pending requests can be approved.'}
      });
      return;
    }
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Approve Request', message: 'Are you sure to Approve this Certificate Request?'}
    });
    confirm.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        let appstatus: boolean = false;
        let appmessage: string = 'Server Not Found';
        this.crs.approve(this.certificaterequest.id).then((responce: [] | undefined) => {
          if (responce != undefined) {
            // @ts-ignore
            appstatus = responce['errors'] == '';
            // @ts-ignore
            if (!appstatus) appmessage = responce['errors'];
          } else {
            appstatus = false;
            appmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (appstatus) {
            appmessage = 'Request Approved Successfully';
            this.loadRequestTable('');
            this.loadStatusSummary();
            this.enableApproveReject(false, false);
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Approve Request', message: appmessage}
          });
          stsmsg.afterClosed().subscribe(async (result: boolean) => { if (!result) return; });
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // REJECT
  // ════════════════════════════════════════════════════════════════════════════
  reject() {
    const rejectReason = this.reqform.controls['rejectreason'].value;
    if (this.certificaterequest.requeststatus?.name !== 'Pending') {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Invalid Action', message: 'Only Pending requests can be rejected.'}
      });
      return;
    }
    if (!rejectReason || rejectReason.trim() == '') {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Reject Request', message: 'Please enter a Reject Reason before rejecting.'}
      });
      errmsg.afterClosed().subscribe(async (result: boolean) => { if (!result) return; });
      return;
    }
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Reject Request', message: 'Are you sure to Reject this Request? <br><br>Reason: ' + rejectReason}
    });
    confirm.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        let rejstatus: boolean = false;
        let rejmessage: string = 'Server Not Found';
        this.crs.reject(this.certificaterequest.id, rejectReason).then((responce: [] | undefined) => {
          if (responce != undefined) {
            // @ts-ignore
            rejstatus = responce['errors'] == '';
            // @ts-ignore
            if (!rejstatus) rejmessage = responce['errors'];
          } else {
            rejstatus = false;
            rejmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (rejstatus) {
            rejmessage = 'Request Rejected Successfully';
            this.loadRequestTable('');
            this.loadStatusSummary();
            this.enableApproveReject(false, false);
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Reject Request', message: rejmessage}
          });
          stsmsg.afterClosed().subscribe(async (result: boolean) => { if (!result) return; });
        });
      }
    });
  }

  get selectedStatus(): Requeststatus {
    return this.reqform.get('requeststatus')?.value;
  }
}
