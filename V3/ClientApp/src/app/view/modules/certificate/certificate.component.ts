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
import {AuthorizationManager} from "../../../service/authorizationmanager";


@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {
  // ── Approved Requests table (select which request to issue a certificate for) ──
  reqcolumns: string[] = ['citizen', 'certificateType', 'requestedDate', 'purpose'];
  reqheaders: string[] = ['Citizen', 'Type', 'Requested Date', 'Purpose'];
  reqbinders: string[] = ['citizen.name', 'certificatetype.name', 'requesteddate', 'purpose'];
  reqrequests: Array<Certificaterequest> = [];
  reqdata!: MatTableDataSource<Certificaterequest>;
  selectedreqrow: any;
  reqsearch!: FormGroup;
  @ViewChild('reqpaginator') reqpaginator!: MatPaginator;

  // ── Certificate table (ALL issued certificates) ─────────────────────────────
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
  statusSummary: Array<{status: string, count: number}> = [];
  currentemployee!: Employee;
  imageurl: string = '';
  scannedimageurl: string = 'assets/default.png';
  today: Date = new Date();   // datepickers use this as their minimum
  hasstoredscan: boolean = false;
  /** true once the officer picks a file but before Upload Scan succeeds */
  scanselected: boolean = false;
  @ViewChild('certpaginator') certpaginator!: MatPaginator;

  // ── Button states ─────────────────────────────────────────────────────────

  enacreate: boolean = false;
  enaupload: boolean = false;
  certFormEnabled: boolean = false;

  hasCreateAuthority: boolean = false;
  hasUploadAuthority: boolean = false;

  uiassist: UiAssist;

  constructor(
    private cs: CertificateService,
    private crs: CertificaterequestService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
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

    this.certform = this.fb.group({
      certificateno: new FormControl('', [Validators.required, Validators.pattern(/^(INC|RES|CHR)CERT\d{4}$/)]),
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

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
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
    // Certificate table shows every issued certificate, independent of selection.
    this.loadCertificateTable('');
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
        this.updateStatusSummary();
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
    this.enableCertButtons(true, false);
    this.selectedcertrow = null;
    this.certform.reset();
    this.scannedimageurl = 'assets/default.png';
    this.scanselected = false;
    this.hasstoredscan = false;
  }

  // ── Certificate table loader (loads ALL certificates when query is empty) ──
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
        this.updateStatusSummary();
      });
  }

  // ── Button state helpers ──────────────────────────────────────────────────
  enableCertButtons(create: boolean, upload: boolean): void {
    this.enacreate = create;
    this.enaupload = upload;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasCreateAuthority = authorities.some(authority => authority.module === 'certificate' && authority.operation === 'insert');
    this.hasUploadAuthority = authorities.some(authority => authority.module === 'certificate' && authority.operation === 'update');
  }

  toggleCertFormState(): void {
    if (this.certFormEnabled) {
      this.certform.enable();
    } else {
      this.certform.disable();
    }
  }

  // ── Client-side filter (issued certificates table) ─────────────────────────
  private isPicked(val: any): boolean {
    return val === true || val === 'true' || val === 1 || val === '1';
  }

  filterCertTable(): void {
    const cs = this.cscertsearch.getRawValue();
    this.certdata.filterPredicate = (cert: Certificate, filter: string) => {
      return (cs.cscertno == null || cert.certificateno?.toLowerCase().includes((cs.cscertno ?? '').toLowerCase())) &&
        (cs.cscertissued == null || cert.issueddate?.includes((cs.cscertissued ?? '').toLowerCase())) &&
        (cs.cscertexpiry == null || cert.expirydate?.includes((cs.cscertexpiry ?? '').toLowerCase())) &&
        (cs.cscertpicked == null || cs.cscertpicked === '' ||
          this.isPicked(cert.hardcopypicked) === (cs.cscertpicked === 'true'));
    };
    this.certdata.filter = 'xx';
  }

  updateStatusSummary(): void {
    this.statusSummary = [
      { status: 'Approved Requests', count: this.reqrequests.length },
      { status: 'Certificates Issued', count: this.certificates.length },
      { status: 'Picked Up', count: this.certificates.filter(c => this.isPicked(c.hardcopypicked)).length },
      { status: 'Not Picked', count: this.certificates.filter(c => !this.isPicked(c.hardcopypicked)).length },
    ];
  }

  // ── Server-side search (issued certificates table — searches ALL certificates) ─
  btnSearchCert(): void {
    const ss = this.sscertsearch.getRawValue();
    let query = '';
    const addParam = (key: string, val: any) => {
      if (val != null && val !== '') {
        query += (query === '' ? '?' : '&') + key + '=' + val;
      }
    };
    addParam('certificateno', ss.sscertno);
    addParam('issueddate', ss.sscertissued);
    addParam('expirydate', ss.sscertexpiry);
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
        this.loadCertificateTable('');
      }
    });
  }


  // ── Fill form from table row (view / continue an in-progress certificate) ──
  fillCertForm(cert: Certificate) {
    this.selectedcertrow = cert;
    this.certificate = JSON.parse(JSON.stringify(cert));
    this.oldcertificate = JSON.parse(JSON.stringify(cert));
    this.hasstoredscan = !!cert.hasscannedcopy;
    this.scannedimageurl = 'assets/default.png';
    this.scanselected = false;
    if (this.hasstoredscan) {
      this.certform.controls['scannedcopy'].clearValidators();
      this.certform.controls['scannedcopy'].updateValueAndValidity();
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
        this.scanselected = true;
        this.certform.controls['scannedcopy'].clearValidators();
        this.certform.controls['scannedcopy'].updateValueAndValidity();
      };
    }
  }

  clearScan(): void {
    this.scannedimageurl = 'assets/default.png';
    this.scanselected = false;
    this.hasstoredscan = false;
    this.certform.controls['scannedcopy'].setErrors({'required': true});
  }

  // ── View the stored scanned copy (PDF) ────────────────────────────────────
  downloadScan(): void {
    this.cs.downloadScannedCopy(this.certificate.id).then(buffer => {
      if (!buffer) { this.noScanMessage(); return; }
      const url = URL.createObjectURL(new Blob([buffer], {type: 'application/pdf'}));
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }).catch(() => this.noScanMessage());
  }

  private noScanMessage(): void {
    this.dg.open(MessageComponent, {
      width: '500px',
      data: {heading: 'Scanned Certificate', message: 'No scanned copy stored for this certificate.'}
    });
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
        this.loadCertificateTable('');
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
      // Format in LOCAL time. toISOString() converts to UTC, which in UTC+5:30
      // rolls the date back a day for anything before 05:30 local.
      const y = expiry.getFullYear();
      const m = String(expiry.getMonth() + 1).padStart(2, '0');
      const d = String(expiry.getDate()).padStart(2, '0');
      this.certificate.expirydate = y + '-' + m + '-' + d;
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
            this.loadCertificateTable('');
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
        })
        .catch((error: any) => {
          uplstatus = false;
          uplmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (uplstatus) {
            uplmessage = 'Scanned Copy Uploaded — Status changed to Certificate Ready';
            // the panel still said 'No scanned copy' until the row was re-selected
            this.hasstoredscan = true;
            this.scanselected = false;
            if (this.certificate) { (this.certificate as any).hasscannedcopy = true; }
            this.loadCertificateTable('');
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
        })
        .catch((error: any) => {
          pkpstatus = false;
          pkpmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (pkpstatus) {
            pkpmessage = 'Certificate Marked as Picked Up';
            this.loadCertificateTable('');
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
