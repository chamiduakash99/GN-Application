import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Certificate} from '../../../entity/certificate';
import {Certificaterequest} from '../../../entity/certificaterequest';
import {Employee} from '../../../entity/employee';
import {CertificateService} from '../../../service/certificateservice';
import {CertificaterequestService} from '../../../service/certificaterequestservice';
import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

// NOTE:
// This component used to depend on an @Input() selectedRequest that was never
// actually bound by any parent (the "certificate" route is standalone), so there
// was no way to pick which Approved request to issue a certificate for. Fixed by
// giving this component its own "Approved Requests" table (requeststatusid = 2)
// to select from — same pattern used everywhere else in this app for tables.
//
// The GN Officer dropdown has also been removed. The officer is always whoever is
// currently logged in (read from localStorage 'employee', same key already set by
// AuthorizationManager.setEmployee()), never a manual selection.

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  // ── Approved Requests table (select which request to issue a certificate for) ──
  reqcolumns: string[] = ['citizen', 'certificateType', 'requestedDate', 'purpose', 'modi'];
  reqheaders: string[] = ['Citizen', 'Type', 'Requested Date', 'Purpose', 'Modification'];
  reqbinders: string[] = ['citizen.name', 'certificatetype.name', 'requesteddate', 'purpose', 'getReqModi()'];
  reqrequests: Array<Certificaterequest> = [];
  reqdata!: MatTableDataSource<Certificaterequest>;
  selectedreqrow: any;
  reqsearch!: FormGroup;
  @ViewChild('reqpaginator') reqpaginator!: MatPaginator;

  // ── Certificate table (issued certificates for the selected request) ──────
  certcolumns: string[] = ['certificateNo', 'issuedDate', 'expiryDate',  'certpick'];
  certheaders: string[] = ['Certificate No', 'Issued Date', 'Expiry Date',  'Mark Picked'];
  certbinders: string[] = ['certificateno', 'issueddate', 'expirydate',  ''];
  cscertcolumns: string[] = ['cscertno', 'cscertissued', 'cscertexpiry', 'cscertpicked'];
  cscertprompts: string[] = ['Search Cert No', 'Search Issued Date', 'Search Expiry Date', 'Search Picked'];

  // ── Forms ─────────────────────────────────────────────────────────────────
  public cscertsearch!: FormGroup;
  public sscertsearch!: FormGroup;
  public certform!: FormGroup;

  // ── Data ──────────────────────────────────────────────────────────────────
  certificaterequest!: Certificaterequest;
  certificate!: Certificate;
  oldcertificate!: Certificate;
  selectedcertrow: any;
  certificates: Array<Certificate> = [];
  certdata!: MatTableDataSource<Certificate>;
  currentemployee!: Employee;
  imageurl: string = '';
  scannedimageurl: string = 'assets/default.png';
  @ViewChild('certpaginator') certpaginator!: MatPaginator;

  // ── Button states ─────────────────────────────────────────────────────────
  enacreate: boolean = false;
  enaupload: boolean = false;
  certFormEnabled: boolean = false;

  uiassist: UiAssist;

  constructor(
    private cs: CertificateService,
    private crs: CertificaterequestService,
    private fb: FormBuilder,
    private dg: MatDialog,
  ) {
    this.uiassist = new UiAssist(this);

    this.reqsearch = this.fb.group({
      'reqcitizen': new FormControl(),
    });

    this.sscertsearch = this.fb.group({
      'sscertno': new FormControl(),
      'sscertissued': new FormControl(),
      'sscertexpiry': new FormControl(),
    });

    this.cscertsearch = this.fb.group({
      'cscertno': new FormControl(),
      'cscertissued': new FormControl(),
      'cscertexpiry': new FormControl(),
      'cscertpicked': new FormControl(),
    });

    // NOTE: 'employee' control removed on purpose — the officer is never picked
    // from a dropdown, it's always the currently logged-in officer (see
    // loadCurrentEmployee() / currentemployee below).
    this.certform = this.fb.group({
      'certificateno': new FormControl('', [Validators.required]),
      'issueddate': new FormControl(''),
      'expirydate': new FormControl('', [Validators.required]),
      'scannedcopy': new FormControl(''),
      'hardcopypicked': new FormControl(false),
      'pickeddate': new FormControl(''),
      'certificaterequest': new FormControl(''),
    }, {updateOn: 'change'});
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadCurrentEmployee();
    this.createView();
    this.enableCertButtons(false, false);
    this.toggleCertFormState();
  }

  // GN Officer is always the one currently logged in — never a dropdown.
  loadCurrentEmployee(): void {
    const employeeString = localStorage.getItem('employee');
    if (employeeString) {
      this.currentemployee = JSON.parse(employeeString);
    }
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    // Only Approved (id = 2) requests are eligible to have a certificate issued.
    this.loadRequestTable('?requeststatusid=2');
  }

  // ── Approved-requests table loader ─────────────────────────────────────────
  loadRequestTable(query: string) {
    this.crs.getAll(query)
      .then((reqs: Certificaterequest[]) => {
        this.reqrequests = reqs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.reqdata = new MatTableDataSource(this.reqrequests);
        this.reqdata.paginator = this.reqpaginator;
      });
  }

  getReqModi(element: Certificaterequest) {
    return element.citizen?.name + ' (' + element.certificatetype?.name + ')';
  }

  filterReqTable(): void {
    const rs = this.reqsearch.getRawValue();
    this.reqdata.filterPredicate = (req: Certificaterequest, filter: string) => {
      return (rs.reqcitizen == null || req.citizen?.name.toLowerCase().includes(rs.reqcitizen.toLowerCase()));
    };
    this.reqdata.filter = 'xx';
  }

  // ── Select an Approved request to issue a certificate for ──────────────────
  selectRequest(req: Certificaterequest) {
    this.selectedreqrow = req;
    this.certificaterequest = req;
    this.certFormEnabled = true;
    this.toggleCertFormState();
    this.loadCertificateTable('?requestId=' + req.id);
    this.enableCertButtons(true, false);
    this.selectedcertrow = null;
    this.certform.reset();
    this.scannedimageurl = 'assets/default.png';
  }

  // ── Certificate table loader ────────────────────────────────────────────────
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

  // ── Button state helpers ──────────────────────────────────────────────────
  enableCertButtons(create: boolean, upload: boolean): void {
    this.enacreate = create;
    this.enaupload = upload;
  }

  toggleCertFormState(): void {
    if (this.certFormEnabled) {
      this.certform.enable();
    } else {
      this.certform.disable();
    }
  }

  // ── Client-side filter (issued certificates table) ─────────────────────────
  filterCertTable(): void {
    const cs = this.cscertsearch.getRawValue();
    this.certdata.filterPredicate = (cert: Certificate, filter: string) => {
      return (cs.cscertno == null || cert.certificateno?.toLowerCase().includes(cs.cscertno)) &&
        (cs.cscertissued == null || cert.issueddate?.includes(cs.cscertissued)) &&
        (cs.cscertexpiry == null || cert.expirydate?.includes(cs.cscertexpiry)) &&
        (cs.cscertpicked == null || String(cert.hardcopypicked).includes(cs.cscertpicked));
    };
    this.certdata.filter = 'xx';
  }

  // ── Server-side search (issued certificates table) ─────────────────────────
  btnSearchCert(): void {
    if (!this.certificaterequest?.id) return;
    const ss = this.sscertsearch.getRawValue();
    let query = '?requestId=' + this.certificaterequest.id;
    if (ss.sscertno != null) query += '&certificateno=' + ss.sscertno;
    if (ss.sscertissued != null) query += '&issueddate=' + ss.sscertissued;
    if (ss.sscertexpiry != null) query += '&expirydate=' + ss.sscertexpiry;
    this.loadCertificateTable(query);
  }

  btnSearchClearCert(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.sscertsearch.reset();
        if (this.certificaterequest?.id) {
          this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
        }
      }
    });
  }

  // ── Fill form from table row (view / continue an in-progress certificate) ──
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
    this.certform.patchValue(this.certificate);
    this.certform.markAsPristine();
    this.enableCertButtons(false, true);
  }

  // ── Scanned image select ──────────────────────────────────────────────────
  selectScan(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.scannedimageurl = event.target.result;
        this.certform.controls['scannedcopy'].clearValidators();
      };
    }
  }

  clearScan(): void {
    this.scannedimageurl = 'assets/default.png';
    this.certform.controls['scannedcopy'].setErrors({'required': true});
  }

  // ── Clear ─────────────────────────────────────────────────────────────────
  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Details?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.certform.reset();
        this.selectedcertrow = null;
        this.enableCertButtons(false, false);
        this.clearScan();
        if (this.certificaterequest?.id) {
          this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
        }
      }
    });
  }

  // ── Create Certificate ────────────────────────────────────────────────────
  createCertificate() {
    let errors = this.getCertErrors();
    if (!this.certificaterequest?.id) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Invalid Action', message: 'Please select an Approved request first.'}
      });
      return;
    }
    if (errors != '') {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Create Certificate', message: 'You have following Errors <br>' + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) return; });
      return;
    }

    this.certificate = this.certform.getRawValue();
    this.certificate.certificaterequest = this.certificaterequest;
    // GN Officer is always the one currently logged in — set directly, no dropdown.
    this.certificate.employee = this.currentemployee;

    // FIX: expirydate comes back as a JS Date object from the datepicker.
    // java.sql.Date on the server can't deserialize a full ISO datetime string,
    // so convert to plain yyyy-MM-dd before sending.
    const expiry: any = this.certificate.expirydate;
    if (expiry instanceof Date) {
      this.certificate.expirydate = expiry.toISOString().split('T')[0];
    }

    let certdata = '<br>Certificate No : ' + this.certificate.certificateno;
    certdata += '<br>Expiry Date : ' + this.certificate.expirydate;
    certdata += '<br>GN Officer : ' + this.currentemployee?.callingname;

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
            else {
              // FIX: capture the generated ID so uploadScan() has something to target
              // @ts-ignore
              this.certificate.id = parseInt(responce['id']);
            }
          } else {
            crtstatus = false;
            crtmessage = 'Content Not Found';
          }
        }).finally(() => {
          if (crtstatus) {
            crtmessage = 'Certificate Created Successfully';
            this.certform.reset();
            this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
            this.enableCertButtons(false, true);
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

  // ── Upload Scan ───────────────────────────────────────────────────────────
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
            uplmessage = 'Scanned Copy Uploaded — Status changed to Certificate Ready';
            this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
            this.enableCertButtons(false, true);
            // The request status just flipped to "Certificate Ready" (4), so it
            // no longer belongs in the Approved-requests list — refresh it.
            this.loadRequestTable('?requeststatusid=2');
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

  // ── Mark Picked Up — direct row action, no need to select into the form ────
  markPickedUp(cert: Certificate) {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Mark Picked Up', message: 'Are you sure to Mark this Certificate as Picked Up?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let pkpstatus: boolean = false;
        let pkpmessage: string = 'Server Not Found';
        this.cs.markPickedUp(cert.id).then((responce: [] | undefined) => {
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

  // ── Error helper ──────────────────────────────────────────────────────────
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
}
