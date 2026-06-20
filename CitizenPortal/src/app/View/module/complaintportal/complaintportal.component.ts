// import {Component, ViewChild} from '@angular/core';
// import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
// import {MatPaginator} from '@angular/material/paginator';
// import {MatTableDataSource} from '@angular/material/table';
// import {MatDialog} from '@angular/material/dialog';
// // @ts-ignore
// import {Complaint} from '../../../entity/complaint';
// // @ts-ignore
// import {Complaintstatus} from '../../../entity/Complaintstatus';
// // @ts-ignore
// import {Citizen} from '../../../entity/Citizen';
// // @ts-ignore
// import {ComplaintService} from '../../../service/complaintservice';
// // @ts-ignore
// import {CitizenService} from '../../../service/CitizenService';
// // @ts-ignore
// import {AuthorizationManager} from '../../../service/authorizationmanager';
// // @ts-ignore
// import {ComplaintStatusService} from '../../../service/complaintstatusservice';
// // @ts-ignore
// import {UiAssist} from '../../../util/ui/ui.assist';
// // @ts-ignore
// import {MessageComponent} from '../../../util/dialog/message/message.component';
// // @ts-ignore
// import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';
//
// @Component({
//   selector: 'app-complaintportal',
//   templateUrl: './complaintportal.component.html',
//   styleUrls: ['./complaintportal.component.css']
// })
// export class ComplaintportalComponent {
//
//   // ─────────────────────────────────────────────
//   // TABLE
//   // ─────────────────────────────────────────────
//   columns: string[] = ['subject', 'status', 'date', 'modi'];
//   headers: string[] = ['Subject', 'Status', 'Complained Date', 'Action'];
//   binders: string[] = [
//     'subject',
//     'complaintstatus.name',
//     'complaineddate',
//     'getModi()'
//   ];
//
//   complaints: Complaint[] = [];
//   data!: MatTableDataSource<Complaint>;
//   selectedRow: any;
//
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//
//   // ─────────────────────────────────────────────
//   // FORMS
//   // ─────────────────────────────────────────────
//   complaintform!: FormGroup;
//
//   // ─────────────────────────────────────────────
//   // DATA
//   // ─────────────────────────────────────────────
//   complaint!: Complaint;
//   oldcomplaint!: Complaint;
//   complaintstatuses: Complaintstatus[] = [];
//
//   uiassist: UiAssist;
//   progressIndex: number = 0;
//
//   constructor(
//     private cs: ComplaintService,
//     private cz: CitizenService,
//     private fb: FormBuilder,
//     private dg: MatDialog,
//     public auth: AuthorizationManager,
//     private css: ComplaintStatusService,
//   ) {
//     this.uiassist = new UiAssist(this);
//
//     this.complaintform = this.fb.group({
//       subject: new FormControl('', [Validators.required]),
//       description: new FormControl('', [Validators.required]),
//       complaintstatus: new FormControl(''),
//       complaineddate: new FormControl(''),
//       rejectreason: new FormControl(''),
//       actiontaken: new FormControl(''),
//       referredto: new FormControl(''),
//     });
//   }
//
//   // ─────────────────────────────────────────────
//   ngOnInit() {
//     this.complaintform = this.fb.group({
//       subject: new FormControl('', Validators.required),
//       description: new FormControl('', Validators.required),
//       complaintstatus: new FormControl(''),
//       complaineddate: new FormControl('')
//     });
//
//     this.loadTable();
//   }
//
//   // ─────────────────────────────────────────────
//   loadTable(query: string = '') {
//     this.cs.getAll(query)
//       .then((res: Complaint[]) => this.complaints = res)
//       .finally(() => {
//         this.data = new MatTableDataSource(this.complaints);
//         this.data.paginator = this.paginator;
//       });
//   }
//
//   // ─────────────────────────────────────────────
//   // TABLE DISPLAY
//   // ─────────────────────────────────────────────
//   getModi(e: Complaint) {
//     return e.complaintstatus?.name;
//   }
//
//   // ─────────────────────────────────────────────
//   // FORM ACTIONS
//   // ─────────────────────────────────────────────
//   add() {
//     if (this.complaintform.invalid) {
//       this.dg.open(MessageComponent, {
//         width: '400px',
//         data: {
//           heading: 'Validation Error',
//           message: 'Please fill all required fields'
//         }
//       });
//       return;
//     }
//
//     const raw = this.complaintform.getRawValue();
//
//     const citizen: Citizen = this.auth.getCurrentCitizen();
//
//     const complaint: Complaint = {
//       id: 0,
//       subject: raw.subject,
//       description: raw.description,
//       complaineddate: new Date().toISOString().split('T')[0],
//       rejectreason: '',
//       actiontaken: '',
//       referredto: '',
//       citizen: citizen,
//       complaintstatus: {id: 1, name: 'Pending'} as Complaintstatus,
//       employee: null as any
//     };
//
//     this.cs.add(complaint)
//       .then(() => {
//         this.dg.open(MessageComponent, {
//           width: '400px',
//           data: {heading: 'Success', message: 'Complaint submitted successfully'}
//         });
//         this.loadTable();
//         this.clear();
//       })
//       .catch(() => {
//         this.dg.open(MessageComponent, {
//           width: '400px',
//           data: {heading: 'Error', message: 'Failed to submit complaint'}
//         });
//       });
//   }
//
//   update() {
//     const raw = this.complaintform.getRawValue();
//     raw.id = this.oldcomplaint.id;
//     raw.citizen = this.oldcomplaint.citizen;
//     raw.complaintstatus = this.oldcomplaint.complaintstatus;
//
//     this.cs.update(raw)
//       .then(() => {
//         this.dg.open(MessageComponent, {
//           width: '400px',
//           data: {heading: 'Updated', message: 'Complaint updated successfully'}
//         });
//         this.loadTable();
//       });
//   }
//
//   delete() {
//     this.dg.open(ConfirmComponent, {
//       width: '400px',
//       data: {
//         heading: 'Confirm Delete',
//         message: 'Delete this complaint?'
//       }
//     }).afterClosed().subscribe(result => {
//       if (result) {
//         this.cs.delete(this.oldcomplaint.id)
//           .then(() => {
//             this.loadTable();
//             this.clear();
//           });
//       }
//     });
//   }
//
//   // ─────────────────────────────────────────────
//   // ROW SELECT
//   // ─────────────────────────────────────────────
//   fillForm(c: Complaint) {
//     this.selectedRow = c;
//     this.complaint = JSON.parse(JSON.stringify(c));
//     this.oldcomplaint = JSON.parse(JSON.stringify(c));
//
//     this.complaintform.patchValue({
//       subject: this.complaint.subject,
//       description: this.complaint.description,
//       complaintstatus: this.complaint.complaintstatus?.name,
//       complaineddate: this.complaint.complaineddate,
//       rejectreason: this.complaint.rejectreason,
//       actiontaken: this.complaint.actiontaken,
//       referredto: this.complaint.referredto
//     });
//
//     this.updateProgressStepper();
//     this.complaintform.markAsPristine();
//   }
//
//   canSubmit(): boolean {
//     return this.complaintform.valid && !this.selectedRow;
//   }
//
//   canUpdate(): boolean {
//     if (!this.selectedRow) return false;
//     const status = this.complaint?.complaintstatus?.name;
//     // only allow update in Pending stage
//     return status === 'Pending';
//   }
//
//   canDelete(): boolean {
//     if (!this.selectedRow) return false;
//     const status = this.complaint?.complaintstatus?.name;
//     // allow delete only before decision
//     return status === 'Pending';
//   }
//
//   updateProgressStepper(): void {
//     const status = this.complaint?.complaintstatus?.name;
//     switch (status) {
//       case 'Pending':
//         this.progressIndex = 1;
//         break;
//       case 'Approved':
//         this.progressIndex = 2;
//         break;
//       case 'Investigating':
//         this.progressIndex = 3;
//         break;
//       case 'Resolved':
//       case 'Passed to Authorities':
//         this.progressIndex = 4;
//         break;
//       case 'Rejected':
//         this.progressIndex = 1;
//         break;
//       default:
//         this.progressIndex = 0;
//     }
//   }
//
//   // ─────────────────────────────────────────────
//   clear() {
//     this.complaintform.reset();
//     this.selectedRow = null;
//   }
// }
