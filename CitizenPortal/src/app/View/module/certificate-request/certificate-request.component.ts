import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Requeststatus} from "../../entity/Requeststatus";
import {Citizen} from "../../entity/Citizen";
import {Certificatetype} from "../../entity/Certificatetype";
import {MatPaginator} from "@angular/material/paginator";
import {CertificateRequestService} from "../../service/Certificaterequestservice";
import {CertificateService} from "../../service/certificateservice";
import {CertificateTypeService} from "../../service/Certificatetypeservice";
import {RequestStatusService} from "../../service/Requeststatusservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {CitizenService} from "../../service/CitizenService";
import {UiAssist} from "../../util/ui/ui.assist";
import {ConfirmComponent} from "../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {Certificaterequest} from '../../entity/certificaterequest';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-certificate-request',
  templateUrl: './certificate-request.component.html',
  styleUrls: ['./certificate-request.component.css']
})
export class CertificateRequestComponent implements OnInit {

  // ─────────────────────────────────────────────
  // TABLE
  // ─────────────────────────────────────────────
  columns: string[] = ['citizen', 'type', 'status', 'date', 'purpose', 'download', 'modi'];
  headers: string[] = ['Citizen', 'Type', 'Status', 'Requested Date', 'Purpose', 'Download', 'Action'];
  binders: string[] = ['citizen.name', 'certificatetype.name', 'requeststatus.name', 'requesteddate', 'purpose', 'getModi()'];

  requests: Certificaterequest[] = [];
  data!: MatTableDataSource<Certificaterequest>;

  selectedRow: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('stepper') stepper?: MatStepper;

  // ─────────────────────────────────────────────
  // FORMS
  // ─────────────────────────────────────────────
  reqform!: FormGroup;

  // ─────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────
  certificaterequest!: Certificaterequest;
  oldcertificaterequest!: Certificaterequest;

  certificatetypes: Certificatetype[] = [];
  citizens: Citizen[] = [];

  ssreqsearch!: FormGroup;
  requeststatuses: Requeststatus[] = [];

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  uiassist: UiAssist;
  progressIndex: number = 0;

  constructor(
    private crs: CertificateRequestService,
    private certService: CertificateService,
    private cts: CertificateTypeService,
    private cs: CitizenService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public auth: AuthorizationManager,
    private rss: RequestStatusService,
  ) {
    this.uiassist = new UiAssist(this);

    this.reqform = this.fb.group({
      citizen: new FormControl('', [Validators.required]),
      certificatetype: new FormControl('', [Validators.required]),
      purpose: new FormControl('', [Validators.required]),
      requeststatus: new FormControl(''),
      requesteddate: new FormControl(''),
      sscitizens: new FormControl(),
      sstype: new FormControl(),
      ssstatus: new FormControl(),
    });
  }

  // ─────────────────────────────────────────────
  ngOnInit() {

    this.reqform = this.fb.group({
      citizen: new FormControl('', Validators.required),
      certificatetype: new FormControl('', Validators.required),
      purpose: new FormControl('', Validators.required),
      requeststatus: new FormControl(''),
      requesteddate: new FormControl('')
    });

    this.ssreqsearch = this.fb.group({
      sscitizens: new FormControl(),
      sstype: new FormControl(),
      ssstatus: new FormControl()
    });

    this.loadInitialData();
    const citizenString = localStorage.getItem("citizen");
    if (!citizenString) {
      this.requests = [];
      return;
    }
    const citizen = JSON.parse(citizenString);
    this.loadTable(this.getUserQuery(citizen.id));
  }

  // ─────────────────────────────────────────────
  loadInitialData() {
    this.cts.getAllList().then((res: Certificatetype[]) => this.certificatetypes = res);
    this.cs.getAllListNameId().then((res: Citizen[]) => {
      this.citizens = res;
      const citizenString = localStorage.getItem("citizen");
      if (!citizenString) {
        this.citizens = [];
        return;
      }
      const citizen = JSON.parse(citizenString);
      this.citizens = this.citizens.filter((c: Citizen) => c.id === citizen.id);
    });
    this.rss.getAllList().then((res: Requeststatus[]) => this.requeststatuses = res);
  }

  getCitizen() {
    const citizenString = localStorage.getItem("citizen");
    if (!citizenString) {
      this.requests = [];
      return;
    }
    return JSON.parse(citizenString);
  }

  loadTable(query: string = '') {
    this.crs.getAll(query)
      .then((res: Certificaterequest[]) => this.requests = res)
      .finally(() => {
        this.data = new MatTableDataSource(this.requests);
        this.data.paginator = this.paginator;
      });
  }

  // ─────────────────────────────────────────────
  // TABLE DISPLAY
  // ─────────────────────────────────────────────
  getModi(e: Certificaterequest) {
    return e.certificatetype?.name + ' - ' + e.requeststatus?.name;
  }

  // ─────────────────────────────────────────────
  // FORM ACTIONS
  // ─────────────────────────────────────────────
  add() {

    if (this.reqform.invalid) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Validation Error', message: 'Please fill all required fields'}
      });
      return;
    }

    const raw = this.reqform.getRawValue();

    const request: Certificaterequest = {
      id: 0,
      citizen: raw.citizen,
      certificatetype: raw.certificatetype,
      purpose: raw.purpose,
      requeststatus: {id: 1, name: 'Pending'} as Requeststatus,
      requesteddate: new Date().toISOString().split('T')[0],
      updateddate: new Date().toISOString().split('T')[0],
      rejectreason: ''
    };

    this.crs.add(request)
      .then(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Success', message: 'Request submitted successfully'}
        });
        this.clear();
        const citizenString = localStorage.getItem("citizen");
        if (!citizenString) { this.requests = []; return; }
        const citizen = JSON.parse(citizenString);
        this.loadTable(this.getUserQuery(citizen.id));
      })
      .catch(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Error', message: 'Failed to submit request'}
        });
      });
  }

  update() {
    if (this.reqform.invalid) {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Cannot update', message: 'Please fill in every required field before updating.'}
      });
      return;
    }
    const raw = this.reqform.getRawValue();
    raw.id = this.oldcertificaterequest.id;
    // the form control holds the status NAME for display; send the real object
    raw.requeststatus = this.certificaterequest.requeststatus ?? null;

    this.crs.update(raw)
      .then(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Updated', message: 'Request updated successfully'}
        });
        const citizenString = localStorage.getItem("citizen");
        if (!citizenString) { this.requests = []; return; }
        const citizen = JSON.parse(citizenString);
        this.loadTable(this.getUserQuery(citizen.id));
      })
      .catch((error: any) => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Update failed',
                 message: error?.error?.errors || error?.error?.message || error?.message || 'The request could not be updated.'}
        });
      });
  }

  delete() {
    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {heading: 'Confirm Delete', message: 'Delete this request?'}
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.crs.delete(this.oldcertificaterequest.id)
          .then(() => {
            this.clear();
            const citizenString = localStorage.getItem("citizen");
            if (!citizenString) { this.requests = []; return; }
            const citizen = JSON.parse(citizenString);
            this.loadTable(this.getUserQuery(citizen.id));
          });
      }
    });
  }

  // ─────────────────────────────────────────────
  // DOWNLOAD CERTIFICATE
  // Citizen clicks Download when status = 'Certificate Ready'
  // → fetches PDF bytes → triggers browser save → marks Completed
  // ─────────────────────────────────────────────

  downloadCertificate(req: Certificaterequest): void {
    const status = req.requeststatus?.name;
    if (status !== 'Certificate Ready' && status !== 'Completed') {
      this.dg.open(MessageComponent, {
        width: '400px',
        data: {heading: 'Not Ready', message: 'Certificate is not ready for download yet'}
      });
      return;
    }

    const alreadyCompleted = status === 'Completed';
    const confirmMessage = alreadyCompleted
      ? 'Download your certificate again?'
      : 'Download your certificate? This will mark the request as Completed.';

    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {heading: 'Download Certificate', message: confirmMessage}
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.certService.getAll(`?requestId=${req.id}`).then((certs: any[]) => {
        if (!certs || certs.length === 0) {
          this.dg.open(MessageComponent, {
            width: '400px',
            data: {heading: 'Not Found', message: 'Certificate file not found. Please contact the GN officer.'}
          });
          return;
        }
        const cert = certs[0];

        this.certService.downloadScannedCopy(cert.id).then((buffer: ArrayBuffer | undefined) => {
          if (!buffer) {
            this.dg.open(MessageComponent, {
              width: '400px',
              data: {heading: 'Not Available', message: 'Certificate file not available. Please contact the GN officer.'}
            });
            return;
          }

          const blob = new Blob([buffer], {type: 'application/pdf'});
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `certificate_${req.id}.pdf`;
          a.click();
          URL.revokeObjectURL(url);

          // Only mark Completed the first time.
          if (alreadyCompleted) return;

          this.crs.complete(req.id).then(() => {
            this.dg.open(MessageComponent, {
              width: '400px',
              data: {heading: 'Success', message: 'Certificate downloaded. Request is now Completed.'}
            });
            const citizenString = localStorage.getItem("citizen");
            if (!citizenString) return;
            const citizen = JSON.parse(citizenString);
            this.loadTable(this.getUserQuery(citizen.id));
          }).catch(() => {
            this.dg.open(MessageComponent, {
              width: '400px',
              data: {heading: 'Downloaded', message: 'Certificate downloaded. Please refresh to see updated status.'}
            });
            const citizenString = localStorage.getItem("citizen");
            if (!citizenString) return;
            const citizen = JSON.parse(citizenString);
            this.loadTable(this.getUserQuery(citizen.id));
          });
        }).catch(() => {
          this.dg.open(MessageComponent, {
            width: '400px',
            data: {heading: 'Error', message: 'Download failed. Please try again.'}
          });
        });
      }).catch(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: {heading: 'Error', message: 'Could not retrieve certificate. Please try again.'}
        });
      });
    });
  }
  // downloadCertificate(req: Certificaterequest): void {
  //
  //   if (req.requeststatus?.name !== 'Certificate Ready') {
  //     this.dg.open(MessageComponent, {
  //       width: '400px',
  //       data: {heading: 'Not Ready', message: 'Certificate is not ready for download yet'}
  //     });
  //     return;
  //   }
  //
  //   this.dg.open(ConfirmComponent, {
  //     width: '400px',
  //     data: {
  //       heading: 'Download Certificate',
  //       message: 'Download your certificate? This will mark the request as Completed.'
  //     }
  //   }).afterClosed().subscribe((confirmed: boolean) => {
  //     if (!confirmed) return;
  //
  //     // Step 1: find certificate linked to this request
  //     this.certService.getAll(`?requestId=${req.id}`).then((certs: any[]) => {
  //
  //       if (!certs || certs.length === 0) {
  //         this.dg.open(MessageComponent, {
  //           width: '400px',
  //           data: {heading: 'Not Found', message: 'Certificate file not found. Please contact the GN officer.'}
  //         });
  //         return;
  //       }
  //
  //       const cert = certs[0];
  //
  //       // Step 2: fetch raw PDF bytes
  //       this.certService.downloadScannedCopy(cert.id).then((buffer: ArrayBuffer | undefined) => {
  //
  //         if (!buffer) {
  //           this.dg.open(MessageComponent, {
  //             width: '400px',
  //             data: {heading: 'Not Available', message: 'Certificate file not available. Please contact the GN officer.'}
  //           });
  //           return;
  //         }
  //
  //         // Trigger browser file download
  //         const blob = new Blob([buffer], {type: 'application/pdf'});
  //         const url  = URL.createObjectURL(blob);
  //         const a    = document.createElement('a');
  //         a.href     = url;
  //         a.download = `certificate_${req.id}.pdf`;
  //         a.click();
  //         URL.revokeObjectURL(url);
  //
  //         // Step 3: mark request as Completed
  //         this.crs.complete(req.id).then(() => {
  //           this.dg.open(MessageComponent, {
  //             width: '400px',
  //             data: {heading: 'Success', message: 'Certificate downloaded. Request is now Completed.'}
  //           });
  //           const citizenString = localStorage.getItem("citizen");
  //           if (!citizenString) return;
  //           const citizen = JSON.parse(citizenString);
  //           this.loadTable(this.getUserQuery(citizen.id));
  //         }).catch(() => {
  //           this.dg.open(MessageComponent, {
  //             width: '400px',
  //             data: {heading: 'Downloaded', message: 'Certificate downloaded. Please refresh to see updated status.'}
  //           });
  //           const citizenString = localStorage.getItem("citizen");
  //           if (!citizenString) return;
  //           const citizen = JSON.parse(citizenString);
  //           this.loadTable(this.getUserQuery(citizen.id));
  //         });
  //
  //       }).catch(() => {
  //         this.dg.open(MessageComponent, {
  //           width: '400px',
  //           data: {heading: 'Error', message: 'Download failed. Please try again.'}
  //         });
  //       });
  //
  //     }).catch(() => {
  //       this.dg.open(MessageComponent, {
  //         width: '400px',
  //         data: {heading: 'Error', message: 'Could not retrieve certificate. Please try again.'}
  //       });
  //     });
  //   });
  // }

  // ─────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.ssreqsearch.getRawValue();
    let query = '';
    if (ss.sscitizens != null) query += '&citizenid=' + ss.sscitizens;
    if (ss.sstype != null) query += '&certificatetypeid=' + ss.sstype;
    if (ss.ssstatus != null) query += '&requeststatusid=' + ss.ssstatus;
    if (query !== '') query = '?' + query.substring(1);
    this.loadTable(query);
  }

  getUserQuery(value: string) {
    let query = '&citizenid=' + value;
    return '?' + query.substring(1);
  }

  btnSearchClearMc(): void {
    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {heading: 'Clear Search', message: 'Clear all filters?'}
    }).afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.ssreqsearch.reset();
        const citizenString = localStorage.getItem("citizen");
        if (!citizenString) { this.requests = []; return; }
        const citizen = JSON.parse(citizenString);
        this.loadTable(this.getUserQuery(citizen.id));
      }
    });
  }

  // ─────────────────────────────────────────────
  // ROW SELECT
  // ─────────────────────────────────────────────
  fillForm(req: Certificaterequest) {
    this.selectedRow = req;
    this.certificaterequest = JSON.parse(JSON.stringify(req));
    this.oldcertificaterequest = JSON.parse(JSON.stringify(req));
    this.stepper?.reset();

    const selectedCitizen = (this.citizens ?? []).find(c => c.id === this.certificaterequest.citizen?.id) ?? null;
    const selectedType    = (this.certificatetypes ?? []).find(t => t.id === this.certificaterequest.certificatetype?.id) ?? null;

    this.reqform.patchValue({
      citizen:         selectedCitizen,
      certificatetype: selectedType,
      purpose:         this.certificaterequest.purpose,
      requeststatus:   this.certificaterequest.requeststatus?.name,
      requesteddate:   this.certificaterequest.requesteddate,
      rejectreason:    this.certificaterequest.rejectreason
    });
    this.updateProgressStepper();
    this.reqform.markAsPristine();
  }

  canSubmit(): boolean {
    return this.reqform.valid && !this.selectedRow;
  }

  canUpdate(): boolean {
    if (!this.selectedRow) return false;
    return this.certificaterequest?.requeststatus?.name === 'Pending';
  }

  canDelete(): boolean {
    if (!this.selectedRow) return false;
    return this.certificaterequest?.requeststatus?.name === 'Pending';
  }

  canDownload(req: Certificaterequest): boolean {
    const status = req.requeststatus?.name;
    return status === 'Certificate Ready' || status === 'Completed';
  }

  updateProgressStepper(): void {
    const status = this.certificaterequest?.requeststatus?.name;
    switch (status) {
      case 'Pending':           this.progressIndex = 1; break;
      case 'Approved':          this.progressIndex = 2; break;
      case 'Certificate Ready': this.progressIndex = 3; break;
      case 'Completed':         this.progressIndex = 4; break;
      case 'Rejected':          this.progressIndex = 1; break;
      default:                  this.progressIndex = 0;
    }
  }

  // ─────────────────────────────────────────────
  clear() {
    this.reqform.reset();
    this.selectedRow = null;
  }
}

