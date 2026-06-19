import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {Complaint} from '../../../entity/complaint';
import {Complaintstatus} from '../../../entity/Complaintstatus';
import {ComplaintService} from '../../../service/complaintservice';
import {ComplaintStatusService} from '../../../service/complaintstatusservice';
import {EmployeeService} from '../../../service/employeeservice';
import {Employee} from '../../../entity/employee';
import {CitizenService} from '../../../service/CitizenService';
import {Citizen} from '../../../entity/Citizen';
import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';
import {AuthorizationManager} from '../../../service/authorizationmanager';

@Component({
  selector: 'app-complaint',
  templateUrl: './complaint.component.html',
  styleUrls: ['./complaint.component.css']
})
export class ComplaintComponent {

  // ── Complaint table ─────────────────────────────────────────────────────
  columns: string[] = ['citizen', 'subject', 'complaintstatus', 'complaineddate', 'modi'];
  headers: string[] = ['Citizen', 'Subject', 'Status', 'Complained Date', 'Modification'];
  binders: string[] = ['citizen.name', 'subject', 'complaintstatus.name', 'complaineddate', 'getModi()'];

  cscolumns: string[] = ['cscitizen', 'cssubject', 'csstatus', 'csdate', 'csmodi'];
  csprompts: string[] = ['Search Citizen', 'Search Subject', 'Search Status', 'Search Date', 'Search Modi'];

  // ── Forms ────────────────────────────────────────────────────────────────
  public cssearch!: FormGroup;
  public ssreqsearch!: FormGroup;
  public complaintform!: FormGroup;
  public actionform!: FormGroup;
  public statuschangeform!: FormGroup;

  // ── Data ─────────────────────────────────────────────────────────────────
  complaint!: Complaint;
  oldcomplaint!: Complaint;
  selectedrow: any;
  complaints: Array<Complaint> = [];
  data!: MatTableDataSource<Complaint>;
  complaintstatuses: Array<Complaintstatus> = [];
  employees: Array<Employee> = [];
  citizens: Array<Citizen> = [];
  statusSummary: any[] = [];
  imageurl: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;

  // ── Button states ────────────────────────────────────────────────────────
  enaapprove: boolean = false;
  enareject: boolean = false;
  enastatuschange: boolean = false;

  uiassist: UiAssist;

  constructor(
    private cs: ComplaintService,
    private css: ComplaintStatusService,
    private es: EmployeeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
    private cs2: CitizenService,
  ) {
    this.uiassist = new UiAssist(this);

    // ── Client-side search form ────────────────────────────────────────
    this.cssearch = this.fb.group({
      'cscitizen': new FormControl(),
      'cssubject': new FormControl(),
      'csstatus': new FormControl(),
      'csdate': new FormControl(),
      'csmodi': new FormControl(),
    });

    // ── Server-side search form ────────────────────────────────────────
    this.ssreqsearch = this.fb.group({
      'sscitizens': new FormControl(),
      'ssstatus': new FormControl(),
    });

    // ── Complaint form (read-only display for officer) ─────────────────
    this.complaintform = this.fb.group({
      'citizen': new FormControl(''),
      'subject': new FormControl(''),
      'description': new FormControl(''),
      'complaintstatus': new FormControl(''),
      'complaineddate': new FormControl(''),
      'rejectreason': new FormControl(''),
      'actiontaken': new FormControl(''),
      'referredto': new FormControl(''),
    });

    // ── Action form (officer fills on approve) ──────────────────────────
    this.actionform = this.fb.group({
      'actiontaken': new FormControl('', [Validators.required]),
      'referredto': new FormControl(''),
      'rejectreason': new FormControl(''),
    }, {updateOn: 'change'});

    // ── Status change form (Approved -> Investigating/Resolved/Passed) ───
    this.statuschangeform = this.fb.group({
      'newstatus': new FormControl('', [Validators.required]),
    });
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadTable('');
    this.css.getAllList().then((statuses: Complaintstatus[]) => {
      this.complaintstatuses = statuses;
    });
    this.es.getAllList().then((emps: Employee[]) => {
      this.employees = emps;
    });
    this.cs2.getAllListNameId().then((ctizens: Citizen[]) => {
      this.citizens = ctizens;
    });
    this.enableApproveReject(false, false);
    this.loadStatusSummary();
  }

  // ── Table loaders ─────────────────────────────────────────────────────────
  loadTable(query: string) {
    this.imageurl = 'assets/pending.gif';
    this.cs.getAll(query)
      .then((complaints: Complaint[]) => {
        this.complaints = complaints;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.complaints);
        this.data.paginator = this.paginator;
      });
  }

  loadStatusSummary() {
    this.cs.getStatusSummary()
      .then((data: any) => {
        this.statusSummary = data;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // ── Button state helpers ────────────────────────────────────────────────
  enableApproveReject(approve: boolean, reject: boolean): void {
    this.enaapprove = approve;
    this.enareject = reject;
  }

  enableStatusChange(enable: boolean): void {
    this.enastatuschange = enable;
  }

  // ── Table helpers ────────────────────────────────────────────────────────
  getModi(element: Complaint) {
    return element.citizen?.name + ' (' + element.complaintstatus?.name + ')';
  }

  // ── Client-side filter ──────────────────────────────────────────────────
  filterTable(): void {
    const cs = this.cssearch.getRawValue();
    this.data.filterPredicate = (c: Complaint, filter: string) => {
      return (cs.cscitizen == null || c.citizen?.name.toLowerCase().includes(cs.cscitizen)) &&
        (cs.cssubject == null || c.subject?.toLowerCase().includes(cs.cssubject)) &&
        (cs.csstatus == null || c.complaintstatus?.name.toLowerCase().includes(cs.csstatus)) &&
        (cs.csdate == null || c.complaineddate?.includes(cs.csdate));
    };
    this.data.filter = 'xx';
  }

  // ── Server-side search ────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.ssreqsearch.getRawValue();
    let query = '';
    if (ss.sscitizens != null) query += '&citizenid=' + ss.sscitizens;
    if (ss.ssstatus != null) query += '&complaintstatusid=' + ss.ssstatus;
    if (query != '') query = query.replace(/^./, '?');
    this.loadTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssreqsearch.reset();
        this.loadTable('');
      }
    });
  }

  // ── Fill form from table row ────────────────────────────────────────────
  fillForm(c: Complaint) {
    const status = c.complaintstatus?.name;
    this.enableApproveReject(status === 'Pending', status === 'Pending');

    // Status can be advanced (Investigating/Resolved/Passed) once Approved,
    // and repeatedly afterwards (Approved -> Investigating -> Resolved etc.)
    this.enableStatusChange(
      status === 'Approved' ||
      status === 'Investigating' ||
      status === 'Resolved' ||
      status === 'Passed to Authorities'
    );

    this.selectedrow = c;
    this.complaint = JSON.parse(JSON.stringify(c));
    this.oldcomplaint = JSON.parse(JSON.stringify(c));

    // @ts-ignore
    this.complaint.citizen = this.citizens.find(ci => ci.id === this.complaint.citizen.id);
    // @ts-ignore
    this.complaint.complaintstatus = this.complaintstatuses.find(s => s.id === this.complaint.complaintstatus.id);

    this.complaintform.patchValue(this.complaint);
    this.complaintform.markAsPristine();

    this.actionform.reset();
    this.actionform.markAsPristine();

    this.statuschangeform.reset();
    this.statuschangeform.markAsPristine();
  }

  // ── Clear ────────────────────────────────────────────────────────────────
  clear(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Details?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.complaintform.reset();
        this.actionform.reset();
        this.statuschangeform.reset();
        this.selectedrow = null;
        this.enableApproveReject(false, false);
        this.enableStatusChange(false);
        this.loadTable('');
      }
    });
  }

  // ════════════════════════════════════════════════════════════════════════
  // GN OFFICER SIDE — APPROVE / REJECT
  // ════════════════════════════════════════════════════════════════════════
  approve(){}
  // approve() {
  //   const actiontaken = this.actionform.controls['actiontaken'].value;
  //   const referredto = this.actionform.controls['referredto'].value;
  //
  //   if (this.complaint.complaintstatus?.name !== 'Pending') {
  //     this.dg.open(MessageComponent, {
  //       width: '400px',
  //       data: {
  //         heading: 'Invalid Action',
  //         message: 'Only Pending complaints can be approved.'
  //       }
  //     });
  //     return;
  //   }
  //
  //   if (!actiontaken || actiontaken.trim() == '') {
  //     const errmsg = this.dg.open(MessageComponent, {
  //       width: '500px',
  //       data: {heading: 'Errors - Approve Complaint', message: 'Please describe the Action Taken before approving.'}
  //     });
  //     errmsg.afterClosed().subscribe(async result => { if (!result) return; });
  //     return;
  //   }
  //
  //   let confirmmsg = 'Are you sure to Approve this Complaint? <br><br>Action Taken: ' + actiontaken;
  //   if (referredto && referredto.trim() != '') {
  //     confirmmsg += '<br>Referred To: ' + referredto;
  //   }
  //
  //   const confirm = this.dg.open(ConfirmComponent, {
  //     width: '500px',
  //     data: {
  //       heading: 'Confirmation - Approve Complaint',
  //       message: confirmmsg
  //     }
  //   });
  //
  //   confirm.afterClosed().subscribe(async result => {
  //     if (result) {
  //       let appstatus: boolean = false;
  //       let appmessage: string = 'Server Not Found';
  //       const employeeid = this.authService.getCurrentEmployeeId();
  //
  //       this.cs.approve(this.complaint.id, actiontaken, referredto, employeeid).then((responce: [] | undefined) => {
  //         if (responce != undefined) {
  //           // @ts-ignore
  //           appstatus = responce['errors'] == '';
  //           // @ts-ignore
  //           if (!appstatus) appmessage = responce['errors'];
  //         } else {
  //           appstatus = false;
  //           appmessage = 'Content Not Found';
  //         }
  //       }).finally(() => {
  //         if (appstatus) {
  //           appmessage = 'Complaint Approved Successfully';
  //           this.loadTable('');
  //           this.enableApproveReject(false, false);
  //         }
  //         const stsmsg = this.dg.open(MessageComponent, {
  //           width: '500px',
  //           data: {heading: 'Status - Approve Complaint', message: appmessage}
  //         });
  //         stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
  //       });
  //     }
  //   });
  // }
  reject(){}
  // reject() {
  //   const rejectreason = this.actionform.controls['rejectreason'].value;
  //
  //   if (this.complaint.complaintstatus?.name !== 'Pending') {
  //     this.dg.open(MessageComponent, {
  //       width: '400px',
  //       data: {
  //         heading: 'Invalid Action',
  //         message: 'Only Pending complaints can be rejected.'
  //       }
  //     });
  //     return;
  //   }
  //
  //   if (!rejectreason || rejectreason.trim() == '') {
  //     const errmsg = this.dg.open(MessageComponent, {
  //       width: '500px',
  //       data: {heading: 'Errors - Reject Complaint', message: 'Please enter a Reject Reason before rejecting.'}
  //     });
  //     errmsg.afterClosed().subscribe(async result => { if (!result) return; });
  //     return;
  //   }
  //
  //   const confirm = this.dg.open(ConfirmComponent, {
  //     width: '500px',
  //     data: {
  //       heading: 'Confirmation - Reject Complaint',
  //       message: 'Are you sure to Reject this Complaint? <br><br>Reason: ' + rejectreason
  //     }
  //   });
  //
  //   confirm.afterClosed().subscribe(async result => {
  //     if (result) {
  //       let rejstatus: boolean = false;
  //       let rejmessage: string = 'Server Not Found';
  //       const employeeid = this.authService.getCurrentEmployeeId();
  //
  //       this.cs.reject(this.complaint.id, rejectreason, employeeid).then((responce: [] | undefined) => {
  //         if (responce != undefined) {
  //           // @ts-ignore
  //           rejstatus = responce['errors'] == '';
  //           // @ts-ignore
  //           if (!rejstatus) rejmessage = responce['errors'];
  //         } else {
  //           rejstatus = false;
  //           rejmessage = 'Content Not Found';
  //         }
  //       }).finally(() => {
  //         if (rejstatus) {
  //           rejmessage = 'Complaint Rejected Successfully';
  //           this.loadTable('');
  //           this.enableApproveReject(false, false);
  //         }
  //         const stsmsg = this.dg.open(MessageComponent, {
  //           width: '500px',
  //           data: {heading: 'Status - Reject Complaint', message: rejmessage}
  //         });
  //         stsmsg.afterClosed().subscribe(async result => { if (!result) return; });
  //       });
  //     }
  //   });
  // }

  // ════════════════════════════════════════════════════════════════════════
  // GN OFFICER SIDE — STATUS PROGRESSION (Approved -> Investigating/Resolved/Passed)
  // ════════════════════════════════════════════════════════════════════════
  changeStatus(){}
  // changeStatus() {
  //   const newstatus = this.statuschangeform.controls['newstatus'].value;
  //
  //   if (!newstatus) {
  //     const errmsg = this.dg.open(MessageComponent, {
  //       width: '500px',
  //       data: {heading: 'Errors - Update Status', message: 'Please select a status to update to.'}
  //     });
  //     errmsg.afterClosed().subscribe(async result => { if (!result) return; });
  //     return;
  //   }
  //
  //   const confirm = this.dg.open(ConfirmComponent, {
  //     width: '500px',
  //     data: {
  //       heading: 'Confirmation - Update Status',
  //       message: 'Are you sure to update this Complaint to "' + newstatus.name + '"?'
  //     }
  //   });
  //
  //   confirm.afterClosed().subscribe(async result => {
  //     if (result) {
  //       let stsstatus: boolean = false;
  //       let stsmessage: string = 'Server Not Found';
  //       const employeeid = this.authService.getCurrentEmployeeId();
  //
  //       this.cs.updateStatus(this.complaint.id, newstatus.id, employeeid).then((responce: [] | undefined) => {
  //         if (responce != undefined) {
  //           // @ts-ignore
  //           stsstatus = responce['errors'] == '';
  //           // @ts-ignore
  //           if (!stsstatus) stsmessage = responce['errors'];
  //         } else {
  //           stsstatus = false;
  //           stsmessage = 'Content Not Found';
  //         }
  //       }).finally(() => {
  //         if (stsstatus) {
  //           stsmessage = 'Status Updated Successfully';
  //           this.loadTable('');
  //         }
  //         const msg = this.dg.open(MessageComponent, {
  //           width: '500px',
  //           data: {heading: 'Status - Update Complaint Status', message: stsmessage}
  //         });
  //         msg.afterClosed().subscribe(async result => { if (!result) return; });
  //       });
  //     }
  //   });
  // }

  get selectedStatus(): Complaintstatus {
    return this.complaintform.get('complaintstatus')?.value;
  }
}
