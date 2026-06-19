import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Certificate} from '../../../entity/certificate';
import {Certificaterequest} from '../../../entity/certificaterequest';
import {Employee} from '../../../entity/employee';
import {CertificateService} from '../../../service/certificateservice';
import {EmployeeService} from '../../../service/employeeservice';
import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {

  // ── Certificate table ─────────────────────────────────────────────────────
  certcolumns: string[] = ['certificateNo', 'issuedDate', 'expiryDate', 'hardCopyPicked', 'pickedDate', 'certmodi'];
  certheaders: string[] = ['Certificate No', 'Issued Date', 'Expiry Date', 'Hard Copy Picked', 'Picked Date', 'Modification'];
  certbinders: string[] = ['certificateno', 'issueddate', 'expirydate', 'hardcopypicked', 'pickeddate', 'getCertModi()'];

  cscertcolumns: string[] = ['cscertno', 'cscertissued', 'cscertexpiry', 'cscertemployee', 'cscertpicked'];
  cscertprompts: string[] = ['Search Cert No', 'Search Issued Date', 'Search Expiry Date', 'Search GN Officer', 'Search Picked'];

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

  employees: Array<Employee> = [];

  imageurl: string = '';
  scannedimageurl: string = 'assets/default.png';

  @ViewChild('certpaginator') certpaginator!: MatPaginator;

  // ── Button states ─────────────────────────────────────────────────────────
  enacreate: boolean = false;
  enaupload: boolean = false;
  enapickup: boolean = false;
  certFormEnabled: boolean = false;

  uiassist: UiAssist;

  constructor(
    private cs: CertificateService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
  ) {
    this.uiassist = new UiAssist(this);

    // ── Client-side search form (certificate table) ──────────────────────
    this.cscertsearch = this.fb.group({
      'cscertno': new FormControl(),
      'cscertissued': new FormControl(),
      'cscertexpiry': new FormControl(),
      'cscertemployee': new FormControl(),
      'cscertpicked': new FormControl(),
    });

    // ── Server-side search form (certificate) ────────────────────────────
    this.sscertsearch = this.fb.group({
      'sscertno': new FormControl(),
      'sscertissued': new FormControl(),
      'sscertexpiry': new FormControl(),
      'sscertemployee': new FormControl(),
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

  // ── Input setter from parent ──────────────────────────────────────────────
  @Input() set selectedRequest(req: Certificaterequest) {
    if (req?.id) {
      this.certificaterequest = req;
      this.certFormEnabled = (
        req.requeststatus?.name === 'Approved' &&
        !req.rejectreason
      );
      this.toggleCertFormState();
      this.loadCertificateTable('?requestId=' + req.id);
      this.enableCertButtons(true, false, false);
      this.selectedcertrow = null;
      this.certform.reset();
      this.scannedimageurl = 'assets/default.png';
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();

    this.es.getAllList().then((emps: Employee[]) => {
      this.employees = emps;
    });

    this.enableCertButtons(false, false, false);
    this.toggleCertFormState();
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadCertificateTable('');
  }

  // ── Table loader ──────────────────────────────────────────────────────────
  loadCertificateTable(query: string) {
    this.cs.getAll(query)
      .then((certs: Certificate[]) => {
        this.certificates = certs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.certdata = new MatTableDataSource(this.certificates);
        this.certdata.paginator = this.certpaginator;
      });
  }

  // ── Button state helpers ──────────────────────────────────────────────────
  enableCertButtons(create: boolean, upload: boolean, pickup: boolean): void {
    this.enacreate = create;
    this.enaupload = upload;
    this.enapickup = pickup;
  }

  toggleCertFormState(): void {
    if (this.certFormEnabled) {
      this.certform.enable();
    } else {
      this.certform.disable();
    }
  }

  // ── Table helper ──────────────────────────────────────────────────────────
  getCertModi(element: Certificate) {
    return element.certificateno + ' (' + (element.hardcopypicked ? 'Picked' : 'Not Picked') + ')';
  }

  // ── Client-side filter ────────────────────────────────────────────────────
  filterCertTable(): void {
    const cs = this.cscertsearch.getRawValue();
    this.certdata.filterPredicate = (cert: Certificate, filter: string) => {
      return (cs.cscertno == null || cert.certificateno?.toLowerCase().includes(cs.cscertno)) &&
        (cs.cscertissued == null || cert.issueddate?.includes(cs.cscertissued)) &&
        (cs.cscertexpiry == null || cert.expirydate?.includes(cs.cscertexpiry)) &&
        (cs.cscertemployee == null || cert.employee?.callingname?.toLowerCase().includes(cs.cscertemployee)) &&
        (cs.cscertpicked == null || String(cert.hardcopypicked).includes(cs.cscertpicked));
    };
    this.certdata.filter = 'xx';
  }

  // ── Server-side search ────────────────────────────────────────────────────
  btnSearchCert(): void {
    const ss = this.sscertsearch.getRawValue();
    let query = '';
    if (ss.sscertno != null) query += '&certificateno=' + ss.sscertno;
    if (ss.sscertissued != null) query += '&issueddate=' + ss.sscertissued;
    if (ss.sscertexpiry != null) query += '&expirydate=' + ss.sscertexpiry;
    if (ss.sscertemployee != null) query += '&employeeid=' + ss.sscertemployee;
    if (query != '') query = query.replace(/^./, '?');
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

  // ── Fill form from table row ──────────────────────────────────────────────
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
        this.enableCertButtons(false, false, false);
        this.clearScan();
        if (this.certificaterequest?.id) {
          this.loadCertificateTable('?requestId=' + this.certificaterequest.id);
        } else {
          this.loadCertificateTable('');
        }
      }
    });
  }

  // ── Create Certificate ────────────────────────────────────────────────────
  createCertificate() {
    let errors = this.getCertErrors();

    if (this.certificaterequest?.requeststatus?.name !== 'Approved') {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Invalid Action', message: 'Certificate can only be created for Approved requests.'}
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
      this.certificate.certificaterequest = this.certificaterequest;

      let certdata = '<br>Certificate No : ' + this.certificate.certificateno;
      certdata += '<br>Expiry Date : ' + this.certificate.expirydate;

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

  // ── Mark Picked Up ────────────────────────────────────────────────────────
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

}
