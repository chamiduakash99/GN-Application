import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Household} from '../../../entity/Household';
import {Citizen} from '../../../entity/Citizen';


import {HouseholdService} from '../../../service/HouseholdService';
import {CitizenService} from '../../../service/CitizenService';
import {CitizenstatusService} from '../../../service/citizenstatusservice';
import {AuthorizationManager} from '../../../service/authorizationmanager';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';
import {Citizenstatus} from "../../../entity/citizenstatus";

@Component({
  selector: 'app-household',
  templateUrl: './household.component.html',
  styleUrls: ['./household.component.css']
})
export class HouseholdComponent implements OnInit {

  // ── Household table ────────────────────────────────────────────────────────
  hhcolumns: string[] = ['householdno', 'address', 'registrationdate', 'headcitizenId', 'membercount', 'modi'];
  hhheaders: string[] = ['Household No', 'Address', 'Registered', 'Head Citizen ID', 'Members', 'Modification'];
  hhbinders: string[] = ['householdno', 'address', 'registrationdate', 'headcitizenId', 'getMemberCount()', 'getModi()'];

  cshhcolumns: string[] = ['cshhno', 'csaddr', 'csdate', 'cshead', 'csmembers', 'csmodi'];
  cshhprompts: string[] = ['Search No', 'Search Address', 'Search Date', 'Search Head ID', 'Search Members', 'Search'];

  // ── Members table ──────────────────────────────────────────────────────────
  memcolumns: string[] = ['name', 'nic', 'dateofbirth', 'mobileno', 'citizenstatus'];
  memheaders: string[] = ['Name', 'NIC', 'Date of Birth', 'Mobile', 'Status'];
  membinders: string[] = ['name', 'nic', 'dateofbirth', 'mobileno', 'citizenstatus.name'];

  // ── Forms ──────────────────────────────────────────────────────────────────
  cssearch!: FormGroup;
  sssearch!: FormGroup;
  hhform!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  household!: Household;
  oldhousehold!: Household;
  selectedrow: any;
  selectedmemberrow: any;

  households: Household[] = [];
  hhdata!: MatTableDataSource<Household>;

  members: Citizen[] = [];
  memdata!: MatTableDataSource<Citizen>;

  citizens: Citizen[] = [];
  citizenstatuses: Citizenstatus[] = [];

  imageurl: string = '';

  @ViewChild('hhpaginator') hhpaginator!: MatPaginator;
  @ViewChild('mempaginator') mempaginator!: MatPaginator;

  // ── Button states ──────────────────────────────────────────────────────────
  enaadd: boolean = true;
  enaupd: boolean = false;
  enadel: boolean = false;

  uiassist: UiAssist;

  constructor(
    private hhs: HouseholdService,
    private cits: CitizenService,
    private css2: CitizenstatusService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    this.cssearch = this.fb.group({
      'cshhno':    new FormControl(),
      'csaddr':    new FormControl(),
      'csdate':    new FormControl(),
      'cshead':    new FormControl(),
      'csmembers': new FormControl(),
      'csmodi':    new FormControl(),
    });

    this.sssearch = this.fb.group({
      'sshouseholdno': new FormControl(),
      'ssaddress':     new FormControl(),
    });

    this.hhform = this.fb.group({
      'householdno':      new FormControl('', [Validators.required]),
      'address':          new FormControl('', [Validators.required]),
      'registrationdate': new FormControl(''),
      'headcitizenId':    new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.imageurl = 'assets/pending.gif';
    this.loadHouseholdTable('');
    this.members = [];
    this.memdata = new MatTableDataSource(this.members);
    this.cits.getAllListNameId().then(res => this.citizens = res);
    this.css2.getAllListNameId().then(res => this.citizenstatuses = res);
    // this.css2.getAllList().then(res => this.citizenstatuses = res);
  }

  // ── Table loaders ──────────────────────────────────────────────────────────
  loadHouseholdTable(query: string): void {
    this.hhs.getAll(query)
      .then((items: Household[]) => {
        this.households = items;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch(error => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.hhdata = new MatTableDataSource(this.households);
        this.hhdata.paginator = this.hhpaginator;
      });
  }

  loadMembersTable(household: Household): void {
    this.members = household.citizensById ?? [];
    this.memdata = new MatTableDataSource(this.members);
    this.memdata.paginator = this.mempaginator;
  }

  // ── Table helpers ──────────────────────────────────────────────────────────
  getModi(element: Household): string {
    return element.householdno + ' — ' + element.address;
  }

  getMemberCount(element: Household): number {
    return element.citizensById?.length ?? 0;
  }

  getHeadCitizenName(headcitizenId: number): string {
    const c = this.citizens.find(x => x.id === headcitizenId);
    return c ? c.name : 'ID: ' + headcitizenId;
  }

  // Helper used in template to display head citizen name for selected household
  get headCitizenName(): string {
    if (!this.household?.headcitizenId) return '';
    return this.getHeadCitizenName(this.household.headcitizenId);
  }

  // ── Client-side filter ─────────────────────────────────────────────────────
  filterTable(): void {
    const cs = this.cssearch.getRawValue();
    this.hhdata.filterPredicate = (h: Household) => {
      return (cs.cshhno == null || h.householdno?.toLowerCase().includes(cs.cshhno)) &&
        (cs.csaddr == null || h.address?.toLowerCase().includes(cs.csaddr));
    };
    this.hhdata.filter = 'xx';
  }

  // ── Server-side search ─────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.sssearch.getRawValue();
    let query = '';
    if (ss.sshouseholdno != null) query += '&householdno=' + ss.sshouseholdno;
    if (ss.ssaddress     != null) query += '&address='     + ss.ssaddress;
    if (query !== '')             query  = query.replace(/^./, '?');
    this.loadHouseholdTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) { this.sssearch.reset(); this.loadHouseholdTable(''); }
    });
  }

  // ── Fill form from row ─────────────────────────────────────────────────────
  fillForm(h: Household): void {
    this.selectedrow  = h;
    this.household    = JSON.parse(JSON.stringify(h));
    this.oldhousehold = JSON.parse(JSON.stringify(h));

    this.hhform.patchValue({
      householdno:      this.household.householdno,
      address:          this.household.address,
      registrationdate: this.household.registrationdate,
      headcitizenId:    this.household.headcitizenId,
    });
    this.hhform.markAsPristine();

    this.enaadd = false;
    this.enaupd = true;
    this.enadel = true;

    this.loadMembersTable(h);
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  getErrors(): string {
    let errors = '';
    for (const controlName in this.hhform.controls) {
      const control = this.hhform.controls[controlName];
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
        this.hhform.reset();
        this.selectedrow = null;
        this.selectedmemberrow = null;
        this.members = [];
        this.memdata = new MatTableDataSource(this.members);
        this.enaadd = true; this.enaupd = false; this.enadel = false;
        this.loadHouseholdTable('');
      }
    });
  }

  // ── Add ────────────────────────────────────────────────────────────────────
  add(): void {
    let errors = this.getErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Add Household', message: 'You have following Errors <br>' + errors}
      });
      return;
    }

    this.household = this.hhform.getRawValue();
    const info = '<br>Household No : ' + this.household.householdno +
      '<br>Address      : ' + this.household.address;

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Add Household', message: 'Are you sure to Add: <br>' + info}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let addstatus = false; let addmessage = 'Server Not Found';
        this.hhs.add(this.household).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            addstatus = response['errors'] == '';
            // @ts-ignore
            if (!addstatus) addmessage = response['errors'];
          } else { addstatus = false; addmessage = 'Content Not Found'; }
        }).finally(() => {
          if (addstatus) { addmessage = 'Household Added Successfully'; this.hhform.reset(); this.loadHouseholdTable(''); }
          this.dg.open(MessageComponent, { width: '500px', data: {heading: 'Status - Add Household', message: addmessage} });
        });
      }
    });
  }

  // ── Update ─────────────────────────────────────────────────────────────────
  update(): void {
    let errors = this.getErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: 'Errors - Update Household', message: 'You have following Errors <br>' + errors}
      });
      return;
    }

    this.household    = this.hhform.getRawValue();
    this.household.id = this.oldhousehold.id;

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Update Household', message: 'Are you sure to Update this Household?'}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let updstatus = false; let updmessage = 'Server Not Found';
        this.hhs.update(this.household).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            updstatus = response['errors'] == '';
            // @ts-ignore
            if (!updstatus) updmessage = response['errors'];
          } else { updstatus = false; updmessage = 'Content Not Found'; }
        }).finally(() => {
          if (updstatus) {
            updmessage = 'Household Updated Successfully';
            this.hhform.reset();
            this.loadHouseholdTable('');
            this.members = [];
            this.memdata = new MatTableDataSource(this.members);
            this.enaadd = true; this.enaupd = false; this.enadel = false;
          }
          this.dg.open(MessageComponent, { width: '500px', data: {heading: 'Status - Update Household', message: updmessage} });
        });
      }
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  delete(): void {
    const memberCount = this.oldhousehold.citizensById?.length ?? 0;
    const warnMsg = memberCount > 0
      ? `This household has <strong>${memberCount} member(s)</strong>. ` +
      'Deleting will fail if members are still assigned. Are you sure to proceed?'
      : 'Are you sure to Delete this Household?';

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Delete Household', message: warnMsg}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus = false; let delmessage = 'Server Not Found';
        this.hhs.delete(this.oldhousehold.id).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            delstatus = response['errors'] == '';
            // @ts-ignore
            if (!delstatus) delmessage = response['errors'];
          } else { delstatus = false; delmessage = 'Content Not Found'; }
        }).finally(() => {
          if (delstatus) {
            delmessage = 'Household Deleted Successfully';
            this.hhform.reset();
            this.loadHouseholdTable('');
            this.members = [];
            this.memdata = new MatTableDataSource(this.members);
            this.enaadd = true; this.enaupd = false; this.enadel = false;
          }
          this.dg.open(MessageComponent, { width: '500px', data: {heading: 'Status - Delete Household', message: delmessage} });
        });
      }
    });
  }
}
