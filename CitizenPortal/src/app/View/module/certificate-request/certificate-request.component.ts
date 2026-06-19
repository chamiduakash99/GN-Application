import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Requeststatus} from "../../entity/Requeststatus";
import {Citizen} from "../../entity/Citizen";
import {Certificatetype} from "../../entity/Certificatetype";
import {MatPaginator} from "@angular/material/paginator";
import {CertificateRequestService} from "../../service/Certificaterequestservice";
import {CertificateTypeService} from "../../service/Certificatetypeservice";
import {RequestStatusService} from "../../service/Requeststatusservice";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {CitizenService} from "../../service/CitizenService";
import {UiAssist} from "../../util/ui/ui.assist";
import {ConfirmComponent} from "../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {Certificaterequest} from '../../entity/certificaterequest';

@Component({
  selector: 'app-certificate-request',
  templateUrl: './certificate-request.component.html',
  styleUrls: ['./certificate-request.component.css']
})
export class CertificateRequestComponent implements OnInit{

  // ─────────────────────────────────────────────
  // TABLE
  // ─────────────────────────────────────────────
  columns: string[] = ['citizen', 'type', 'status', 'date', 'purpose', 'modi'];
  headers: string[] = ['Citizen', 'Type', 'Status', 'Requested Date', 'Purpose', 'Action'];
  binders: string[] = [
    'citizen.name',
    'certificatetype.name',
    'requeststatus.name',
    'requesteddate',
    'purpose',
    'getModi()'
  ];

  requests: Certificaterequest[] = [];
  data!: MatTableDataSource<Certificaterequest>;

  selectedRow: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  // enaadd: boolean = false;
  // enaupd: boolean = false;
  // enadel: boolean = false;

  uiassist: UiAssist;
  progressIndex: number = 0;

  constructor(
    private crs: CertificateRequestService,
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
    if (!citizenString){
      this.requests = [];
      return;
    }
    const  citizen = JSON.parse(citizenString);
    console.log(this.getUserQuery(citizen.id))
    this.loadTable(this.getUserQuery(citizen.id));
  }

  // ─────────────────────────────────────────────
  loadInitialData() {
    this.cts.getAllList().then(res => this.certificatetypes = res);
    this.cs.getAllListNameId().then((res:Citizen[]) => {
      this.citizens = res
      const citizenString = localStorage.getItem("citizen");
      if (!citizenString){
        this.citizens = [];
        return;
      }
      const  citizen = JSON.parse(citizenString);
      this.citizens = this.citizens.filter((c:Citizen)=>{
        return c.id === citizen.id
      });

    });
    this.rss.getAllList().then(res => this.requeststatuses = res);
  }

  getCitizen(){
    const citizenString = localStorage.getItem("citizen");
    if (!citizenString){
      this.requests = [];
      return;
    }
    return JSON.parse(citizenString)
  }
  loadTable(query: string = '') {



    this.crs.getAll(query)
      .then(res => this.requests = res)
      .finally(() => {

        this.data = new MatTableDataSource(this.requests);
        this.data.paginator = this.paginator;

      });
  }

  // loadTable(query: string = '') {
  //   this.crs.getAll('')
  //     .then(res => this.requests = res)
  //     .finally(() => {
  //       this.data = new MatTableDataSource(this.requests);
  //       this.data.paginator = this.paginator;
  //     });
  // }

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
        data: {
          heading: 'Validation Error',
          message: 'Please fill all required fields'
        }
      });
      return;
    }

    const raw = this.reqform.getRawValue();

    const request: Certificaterequest = {
      id: 0,
      citizen: raw.citizen,
      certificatetype: raw.certificatetype,
      purpose: raw.purpose,
      requeststatus: { id: 1, name: 'Pending' } as Requeststatus,
      requesteddate: new Date().toISOString().split('T')[0],
      updateddate: new Date().toISOString().split('T')[0],
      rejectreason: ''
    };

    this.crs.add(request)
      .then(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: { heading: 'Success', message: 'Request submitted successfully' }
        });
        this.clear();

        const citizenString = localStorage.getItem("citizen");
        if (!citizenString){
          this.requests = [];
          return;
        }
        const  citizen = JSON.parse(citizenString);
        this.loadTable(this.getUserQuery(citizen.id));
      })
      .catch(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: { heading: 'Error', message: 'Failed to submit request' }
        });
      });
  }

  update() {

    const raw = this.reqform.getRawValue();
    raw.id = this.oldcertificaterequest.id;

    this.crs.update(raw)
      .then(() => {
        this.dg.open(MessageComponent, {
          width: '400px',
          data: { heading: 'Updated', message: 'Request updated successfully' }
        });
        const citizenString = localStorage.getItem("citizen");
        if (!citizenString){
          this.requests = [];
          return;
        }
        const  citizen = JSON.parse(citizenString);
        this.loadTable(this.getUserQuery(citizen.id));
      });
  }

  delete() {

    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: 'Confirm Delete',
        message: 'Delete this request?'
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.crs.delete(this.oldcertificaterequest.id)
          .then(() => {
            this.clear();
            const citizenString = localStorage.getItem("citizen");
            if (!citizenString){
              this.requests = [];
              return;
            }
            const  citizen = JSON.parse(citizenString);
            this.loadTable(this.getUserQuery(citizen.id));
          });
      }
    });
  }

  btnSearchMc(): void {

    const ss = this.ssreqsearch.getRawValue();

    let query = '';

    if (ss.sscitizens != null) query += '&citizenid=' + ss.sscitizens;
    if (ss.sstype != null) query += '&certificatetypeid=' + ss.sstype;
    if (ss.ssstatus != null) query += '&requeststatusid=' + ss.ssstatus;

    if (query !== '') query = '?' + query.substring(1);

    this.loadTable(query);
  }

  getUserQuery(value:string){
    let query = '';
    query += '&citizenid=' + value
    if (query !== '') query = '?' + query.substring(1);
    return query;
  }
  btnSearchClearMc(): void {

    this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: 'Clear Search',
        message: 'Clear all filters?'
      }
    }).afterClosed().subscribe(result => {

      if (result) {
        this.ssreqsearch.reset();
        const citizenString = localStorage.getItem("citizen");
        if (!citizenString){
          this.requests = [];
          return;
        }
        const  citizen = JSON.parse(citizenString);
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

    // this.reqform.patchValue(this.certificaterequest);
    const selectedCitizen = this.citizens.find(
      c => c.id === this.certificaterequest.citizen?.id
    );

    const selectedType = this.certificatetypes.find(
      t => t.id === this.certificaterequest.certificatetype?.id
    );

    this.reqform.patchValue({
      citizen: selectedCitizen,
      certificatetype: selectedType,
      purpose: this.certificaterequest.purpose,
      requeststatus: this.certificaterequest.requeststatus?.name,
      requesteddate: this.certificaterequest.requesteddate,
      rejectreason: this.certificaterequest.rejectreason
    });
    this.updateProgressStepper();
    this.reqform.markAsPristine();
  }

  canSubmit(): boolean {
    return this.reqform.valid && !this.selectedRow;
  }

  canUpdate(): boolean {
    if (!this.selectedRow) return false;

    const status = this.certificaterequest?.requeststatus?.name;

    // only allow update in Pending stage
    return status === 'Pending';
  }

  canDelete(): boolean {
    if (!this.selectedRow) return false;

    const status = this.certificaterequest?.requeststatus?.name;

    // allow delete only before approval
    return status === 'Pending';
  }

  updateProgressStepper(): void {

    const status = this.certificaterequest?.requeststatus?.name;

    switch (status) {

      case 'Pending':
        this.progressIndex = 1;
        break;

      case 'Approved':
        this.progressIndex = 2;
        break;

      case 'Certificate Ready':
        this.progressIndex = 3;
        break;

      case 'Completed':
        this.progressIndex = 4;
        break;

      case 'Rejected':
        this.progressIndex = 1;
        break;

      default:
        this.progressIndex = 0;

    }

  }

  // ─────────────────────────────────────────────
  clear() {
    this.reqform.reset();
    this.selectedRow = null;
  }

}






