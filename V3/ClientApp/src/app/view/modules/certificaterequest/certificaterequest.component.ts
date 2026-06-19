import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Certificaterequest} from '../../../entity/certificaterequest';
import {Certificate} from '../../../entity/certificate';
import {Certificatetype} from '../../../entity/Certificatetype';
import {Requeststatus} from '../../../entity/Requeststatus';
import {CertificateRequestService} from '../../../service/certificaterequestservice';
import {CertificateService} from '../../../service/certificateservice';
import {CertificateTypeService} from '../../../service/certificatetypeservice';
import {RequestStatusService} from '../../../service/requeststatusservice';
import {EmployeeService} from '../../../service/employeeservice';
import {Employee} from '../../../entity/employee';
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
export class CertificaterequestComponent {

  // // ── Active tab: 'citizen' | 'officer' ────────────────────────────────────
  // activeTab: string = 'citizen';

  // ── Request table ─────────────────────────────────────────────────────────
  reqcolumns: string[] = ['citizen', 'certificateType', 'requestStatus', 'requestedDate', 'purpose', 'modi'];
  reqheaders: string[] = ['Citizen', 'Type', 'Status', 'Requested Date', 'Purpose', 'Modification'];
  reqbinders: string[] = ['citizen.name', 'certificatetype.name', 'requeststatus.name', 'requesteddate', 'purpose', 'getModi()'];

  csreqcolumns: string[] = ['cscitizen', 'cstype', 'csstatus', 'csdate', 'cspurpose', 'csmodi'];
  csreqprompts: string[] = ['Search Citizen', 'Search Type', 'Search Status', 'Search Date', 'Search Purpose', 'Search Modi'];

  // ── Certificate table ─────────────────────────────────────────────────────
  certcolumns: string[] = ['certificateNo', 'issuedDate', 'expiryDate', 'hardCopyPicked', 'pickedDate', 'certmodi'];
  certheaders: string[] = ['Certificate No', 'Issued Date', 'Expiry Date', 'Hard Copy Picked', 'Picked Date', 'Modification'];
  certbinders: string[] = ['certificateno', 'issueddate', 'expirydate', 'hardcopypicked', 'pickeddate', 'getCertModi()'];

  cscertcolumns: string[] = ['cscertno', 'cscertissued', 'cscertpicked'];
  cscertprompts: string[] = ['Search Cert No', 'Search Issued Date', 'Search Picked'];

  // ── Forms ─────────────────────────────────────────────────────────────────
  public csreqsearch!: FormGroup;
  public ssreqsearch!: FormGroup;
  public reqform!: FormGroup;

  public cscertsearch!: FormGroup;
  public certform!: FormGroup;

  // ── Data ──────────────────────────────────────────────────────────────────
  certificaterequest!: Certificaterequest;
  oldcertificaterequest!: Certificaterequest;

  certificate!: Certificate;
  oldcertificate!: Certificate;

  selectedreqrow: any;
  selectedcertrow: any;

  certificaterequests: Array<Certificaterequest> = [];
  reqdata!: MatTableDataSource<Certificaterequest>;

  certificates: Array<Certificate> = [];
  certdata!: MatTableDataSource<Certificate>;

  certificatetypes: Array<Certificatetype> = [];
  requeststatuses: Array<Requeststatus> = [];
  employees: Array<Employee> = [];
  citizens: Array<Citizen> = [];
  statusSummary: any[] = [];

  imageurl: string = '';
  scannedimageurl: string = 'assets/default.png';

  @ViewChild('reqpaginator') reqpaginator!: MatPaginator;
  @ViewChild('certpaginator') certpaginator!: MatPaginator;

  // ── Button states ─────────────────────────────────────────────────────────
  enaapprove: boolean = false;
  enareject: boolean = false;
  enacreate: boolean = false;
  enaupload: boolean = false;
  enapickup: boolean = false;
  certFormEnabled: boolean = false;


  uiassist: UiAssist;

  constructor(
    private crs: CertificateRequestService,
    private cs: CertificateService,
    private cts: CertificateTypeService,
    private rss: RequestStatusService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
    private cs2: CitizenService,
  ) {
    this.uiassist = new UiAssist(this);

    // ── Client-side search form (request table) ──────────────────────────
    this.csreqsearch = this.fb.group({
      'cscitizen': new FormControl(),
      'cstype': new FormControl(),
      'csstatus': new FormControl(),
      'csdate': new FormControl(),
      'cspurpose': new FormControl(),
      'csmodi': new FormControl(),
    });

    // ── Server-side search form (request) ────────────────────────────────
    this.ssreqsearch = this.fb.group({
      'sscitizens': new FormControl(),
      'sstype': new FormControl(),
      'ssstatus': new FormControl(),
      'sspurpose': new FormControl(),
    });

    // ── Request form ─────────────────────────────────────────────────────
    this.reqform = this.fb.group({
      'citizen': new FormControl('', [Validators.required]),
      'certificatetype': new FormControl('', [Validators.required]),
      'purpose': new FormControl('', [Validators.required]),
      'rejectreason': new FormControl(''),
      'requeststatus': new FormControl(''),
      'requesteddate': new FormControl(''),
      'updateddate': new FormControl(''),
    }, {updateOn: 'change'});

    // ── Client-side search form (certificate table) ──────────────────────
    this.cscertsearch = this.fb.group({
      'cscertno': new FormControl(),
      'cscertissued': new FormControl(),
      'cscertpicked': new FormControl(),
    });

    // ── Certificate form ─────────────────────────────────────────────────
    this.certform = this.fb.group({
      'certificateno': new FormControl('', [Validators.required]),
      'issueddate': new FormControl(''),
      'expirydate': new FormControl('', [Validators.required]),
      'scannedcopy': new FormControl(''),
      'hardcopypicked': new FormControl(false),
      'pickeddate': new FormControl(''),
      'employee': new FormControl('', [Validators.required]),
      'certificaterequest': new FormControl(''),
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

    this.es.getAllList().then((emps: Employee[]) => {
      this.employees = emps;
    });

    this.cs2.getAllListNameId().then((ctizens: Citizen[]) => {
      this.citizens = ctizens;
    });


    this.enableCertButtons(false, false, false);
    this.toggleCertFormState();
    this.loadStatusSummary();
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadRequestTable('');
    this.loadCertificateTable('');
  }

  // ── Table loaders ─────────────────────────────────────────────────────────
  loadRequestTable(query: string) {
    this.crs.getAll(query)
      .then((reqs: Certificaterequest[]) => {
        this.certificaterequests = reqs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.reqdata = new MatTableDataSource(this.certificaterequests);
        this.reqdata.paginator = this.reqpaginator;
      });
  }

  loadCertificateTable(query: string) {
    this.cs.getAll(query)
      .then((certs: Certificate[]) => {
        this.certificates = certs;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.certdata = new MatTableDataSource(this.certificates);
        this.certdata.paginator = this.certpaginator;
      });
  }

  loadStatusSummary() {

    this.crs.getStatusSummary()
      .then((data: any) => {

        this.statusSummary = data;

      })
      .catch((error) => {

        console.log(error);

      });

  }

  // ── Tab switch ────────────────────────────────────────────────────────────
  // switchTab(tab: string) {
  //   this.activeTab = tab;
  // }

  // ── Button state helpers ──────────────────────────────────────────────────

  enableCertButtons(create: boolean, upload: boolean, pickup: boolean): void {
    this.enacreate = create;
    this.enaupload = upload;
    this.enapickup = pickup;
  }

  enableApproveReject(approve: boolean, reject: boolean): void {
    this.enaapprove = approve;
    this.enareject = reject;
  }
  toggleCertFormState(): void {

    if (this.certFormEnabled) {
      this.certform.enable();
    } else {
      this.certform.disable();
    }

  }



  // ── Table helpers ─────────────────────────────────────────────────────────
  getModi(element: Certificaterequest) {
    return element.citizen?.name + ' (' + element.certificatetype?.name + ')';
  }

  getCertModi(element: Certificate) {
    return element.certificateno + ' (' + (element.hardcopypicked ? 'Picked' : 'Not Picked') + ')';
  }

  // ── Client-side filter (request table) ───────────────────────────────────
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

  // ── Client-side filter (certificate table) ───────────────────────────────
  filterCertTable(): void {
    const cs = this.cscertsearch.getRawValue();
    this.certdata.filterPredicate = (cert: Certificate, filter: string) => {
      return (cs.cscertno == null || cert.certificateno?.toLowerCase().includes(cs.cscertno)) &&
        (cs.cscertissued == null || cert.issueddate?.includes(cs.cscertissued)) &&
        (cs.cscertpicked == null || String(cert.hardcopypicked).includes(cs.cscertpicked));
    };
    this.certdata.filter = 'xx';
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
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssreqsearch.reset();
        this.loadRequestTable('');
      }
    });
  }

  // ── Fill form from table row (Request) ────────────────────────────────────
  fillReqForm(req: Certificaterequest) {

    const status = req.requeststatus?.name;

    this.enableApproveReject(status === 'Pending', status === 'Pending');
    // this.enableApproveReject(true, true);

    this.selectedreqrow = req;
    this.certificaterequest = JSON.parse(JSON.stringify(req));
    this.oldcertificaterequest = JSON.parse(JSON.stringify(req));

    // @ts-ignore
    this.certificaterequest.citizen =
      this.citizens.find(c => c.id === this.certificaterequest.citizen.id);

    // @ts-ignore
    this.certificaterequest.certificatetype = this.certificatetypes.find(t => t.id === this.certificaterequest.certificatetype.id);
    // @ts-ignore
    this.certificaterequest.requeststatus = this.requeststatuses.find(s => s.id === this.certificaterequest.requeststatus.id);

    this.reqform.patchValue(this.certificaterequest);
    this.reqform.markAsPristine();

    // Enable cert form only for approved requests
    // this.certFormEnabled = req.requeststatus?.name === 'Approved';
    this.certFormEnabled = (
      req.requeststatus?.name === 'Approved' &&
      !req.rejectreason
    );
    this.toggleCertFormState();

    // load certificate linked to this request
    this.loadCertificateTable('?requestId=' + req.id);
    this.enableCertButtons(true, false, false);
  }

  // ── Fill form from table row (Certificate) ────────────────────────────────
  fillCertForm(cert: Certificate) {
    this.selectedcertrow = cert;
    this.certificate = JSON.parse(JSON.stringify(cert));
    this.oldcertificate = JSON.parse(JSON.stringify(cert));

    if (this.certificate.scannedcopy != null) {
      this.scannedimageurl = atob(this.certificate.scannedcopy);
      this.certform.controls['scannedcopy'].clearValidators();
    } else {
      this.scannedimageurl = 'assets/default.png';
    }

    // @ts-ignore
    this.certificate.employee = this.employees.find(e => e.id === this.certificate.employee.id);

    this.certform.patchValue(this.certificate);
    this.certform.markAsPristine();

    this.enableCertButtons(false, true, !cert.hardcopypicked);
  }

  // ── Get dirty field list ──────────────────────────────────────────────────
  getReqUpdates(): string {
    let updates = '';
    for (const controlName in this.reqform.controls) {
      const control = this.reqform.controls[controlName];
      if (control.dirty) {
        updates += '<br>' + controlName.charAt(0).toUpperCase() + controlName.slice(1) + ' Changed';
      }
    }
    return updates;
  }

  getReqErrors(): string {
    let errors = '';
    for (const controlName in this.reqform.controls) {
      const control = this.reqform.controls[controlName];
      if (control.errors) {
        errors += '<br>Invalid ' + controlName.charAt(0).toUpperCase() + controlName.slice(1);
      }
    }
    return errors;
  }

  getCertErrors(): string {
    let errors = '';
    for (const controlName in this.certform.controls) {
      const control = this.certform.controls[controlName];
      if (control.errors) {
        errors += '<br>Invalid ' + controlName.charAt(0).toUpperCase() + controlName.slice(1);
      }
    }
    return errors;
  }

  // ── Scanned image select ──────────────────────────────────────────────────
  selectScan(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.scannedimageurl = event.target.result;
        this.certform.controls['scannedCopy'].clearValidators();
      };
    }
  }

  clearScan(): void {
    this.scannedimageurl = 'assets/default.png';
    this.certform.controls['scannedcopy'].setErrors({'required': true});
  }


  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Details?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.reqform.reset();
        this.certform.reset();
        this.selectedreqrow = null;
        this.selectedcertrow = null;
        this.enableCertButtons(false, false, false);
        this.enableApproveReject(false, false);
        this.certFormEnabled = false;
        this.toggleCertFormState();
        this.clearScan();
        this.loadRequestTable('');
        this.loadCertificateTable('');
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // GN OFFICER SIDE — APPROVE / REJECT / CREATE / UPLOAD / PICKUP
  // ══════════════════════════════════════════════════════════════════════════

  approve() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: 'Confirmation - Approve Request',
        message: 'Are you sure to Approve this Certificate Request?'
      }
    });

    if (this.certificaterequest.requeststatus?.name !== 'Pending') {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {
          heading: 'Invalid Action',
          message: 'Only Pending requests can be approved.'
        }
      });
      return;
    }

    confirm.afterClosed().subscribe(async result => {
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
            this.enableApproveReject(false, false);
            this.enableCertButtons(true, false, false);
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Approve Request', message: appmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
        });
      }
    });
  }

  reject() {
    const rejectReason = this.reqform.controls['rejectreason'].value;

    if (this.certificaterequest.requeststatus?.name !== 'Pending') {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {
          heading: 'Invalid Action',
          message: 'Only Pending requests can be rejected.'
        }
      });
      return;
    }

    if (!rejectReason || rejectReason.trim() == '') {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Reject Request', message: 'Please enter a Reject Reason before rejecting.'}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) return; });
      return;
    }

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: 'Confirmation - Reject Request',
        message: 'Are you sure to Reject this Request? <br><br>Reason: ' + rejectReason
      }
    });

    confirm.afterClosed().subscribe(async result => {
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
            this.enableApproveReject(false, false);
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Reject Request', message: rejmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
        });
      }
    });
  }

  createCertificate() {
    let errors = this.getCertErrors();

    if (this.certificaterequest.requeststatus?.name !== 'Approved') {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {
          heading: 'Invalid Action',
          message: 'Certificate can only be created for Approved requests.'
        }
      });
      return;
    }

    if (errors != '') {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Create Certificate', message: 'You have following Errors <br>' + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) return; });
    } else {
      this.certificate = this.certform.getRawValue();
      let certdata = '<br>Certificate No : ' + this.certificate.certificateno;
      certdata += '<br>Expiry Date : ' + this.certificate.expirydate;
      certdata += '<br>GN Officer : ' + this.certificate.employee?.callingname;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {heading: 'Confirmation - Create Certificate', message: 'Are you sure to Create the following Certificate? <br><br>' + certdata}
      });

      let crtstatus: boolean = false;
      let crtmessage: string = 'Server Not Found';

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.cs.add(this.certificate).then((responce: [] | undefined) => {
            if (responce != undefined) {
              // @ts-ignore
              crtstatus = responce['errors'] == '';
              // @ts-ignore
              if (!crtstatus) crtmessage = responce['errors'];
            } else {
              crtstatus = false;
              crtmessage = 'Content Not Found';
            }
          }).finally(() => {
            if (crtstatus) {
              crtmessage = 'Certificate Created Successfully';
              this.certform.reset();
              this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
              this.enableCertButtons(false, true, false);
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: 'Status - Create Certificate', message: crtmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
          });
        }
      });
    }
  }

  uploadScan() {
    if (this.scannedimageurl === 'assets/default.png') {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Upload Scan', message: 'Please select a scanned certificate image first.'}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) return; });
      return;
    }

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Upload Scan', message: 'Are you sure to Upload the Scanned Certificate?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let uplstatus: boolean = false;
        let uplmessage: string = 'Server Not Found';

        const byteCharacters = atob(this.scannedimageurl.split(',')[1]);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        this.cs.uploadScan(this.certificate.id, byteArray).then((responce: [] | undefined) => {
          if (responce != undefined) {
            // @ts-ignore
            uplstatus = responce['errors'] == '';
            // @ts-ignore
            if (!uplstatus) uplmessage = responce['errors'];
          } else {
            uplstatus = false;
            uplmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (uplstatus) {
            uplmessage = 'Scanned Copy Uploaded Successfully';
            this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
            this.enableCertButtons(false, true, true);
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Upload Scan', message: uplmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
        });
      }
    });
  }

  markPickedUp() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Mark Picked Up', message: 'Are you sure to Mark this Certificate as Picked Up?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let pkpstatus: boolean = false;
        let pkpmessage: string = 'Server Not Found';

        this.cs.markPickedUp(this.certificate.id).then((responce: [] | undefined) => {
          if (responce != undefined) {
            // @ts-ignore
            pkpstatus = responce['errors'] == '';
            // @ts-ignore
            if (!pkpstatus) pkpmessage = responce['errors'];
          } else {
            pkpstatus = false;
            pkpmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (pkpstatus) {
            pkpmessage = 'Certificate Marked as Picked Up';
            this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
            this.enableCertButtons(false, true, false);
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: 'Status - Mark Picked Up', message: pkpmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
        });
      }
    });
  }
  get selectedStatus(): Requeststatus {
    return this.reqform.get('requeststatus')?.value;
  }

}
