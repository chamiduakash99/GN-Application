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
  hhcolumns: string[] = ['householdno', 'address', 'registrationdate', 'headcitizenId', 'membercount'];
  hhheaders: string[] = ['Household No', 'Address', 'Registered', 'Head Citizen ID', 'Members'];
  hhbinders: string[] = ['householdno', 'address', 'registrationdate', 'headcitizenId', 'getMemberCount()'];

  cshhcolumns: string[] = ['cshhno', 'csaddr', 'cspad1', 'cspad2', 'cspad3'];
  cshhprompts: string[] = ['Search No', 'Search Address', '', '', ''];

  // ── Members table ──────────────────────────────────────────────────────────
  memcolumns: string[] = ['name', 'nic', 'dateofbirth', 'mobileno', 'citizenstatus', 'memremove'];
  memheaders: string[] = ['Name', 'NIC', 'Date of Birth', 'Mobile', 'Status', 'Remove'];
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
  /** citizens with no household yet - the Add Member picker feeds off this */
  unassigned: Citizen[] = [];
  membertoadd: any = null;
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


  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

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
      'householdno': new FormControl('', [Validators.required, Validators.pattern(/^HH\d{3}$/), Validators.maxLength(55)]),
      'address': new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z0-9.,'\s-]{2,255}$/), Validators.maxLength(255)]),
      'registrationdate': new FormControl(new Date(), [Validators.required]),
      'headcitizenId': new FormControl('', [Validators.required]),
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
    this.loadUnassigned();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

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
    const c = (this.citizens ?? []).find(x => x.id === headcitizenId);
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
      return (cs.cshhno == null || h.householdno?.toLowerCase().includes((cs.cshhno ?? '').toLowerCase())) &&
        (cs.csaddr == null || h.address?.toLowerCase().includes((cs.csaddr ?? '').toLowerCase()));
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

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'household' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'household' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'household' && authority.operation === 'delete');

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
        })
        .catch((error: any) => {
          addstatus = false;
          addmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
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
        })
        .catch((error: any) => {
          updstatus = false;
          updmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
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
      'They will be unassigned from any household - the citizen records themselves are kept. ' +
      'Are you sure to proceed?'
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
        })
        .catch((error: any) => {
          delstatus = false;
          delmessage = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
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

  // ── Membership ─────────────────────────────────────────────────────────────

  loadUnassigned(): void {
    this.hhs.unassignedCitizens()
      .then(res => this.unassigned = res ?? [])
      .catch(() => this.unassigned = []);
  }

  /** refresh the selected household so the members table and counts stay truthful */
  private reloadSelectedHousehold(): void {
    const id = this.household?.id;
    this.hhs.getAll("").then((items: Household[]) => {
      this.households = items;
      this.hhdata = new MatTableDataSource(this.households);
      this.hhdata.paginator = this.hhpaginator;
      const fresh = (this.households ?? []).find(h => h.id === id);
      if (fresh) {
        this.household = fresh;
        this.selectedrow = fresh;
        this.loadMembersTable(fresh);
      }
      this.loadUnassigned();
    });
  }

  addMember(): void {
    if (!this.household?.id) {
      this.dg.open(MessageComponent, {width: "500px",
        data: {heading: "Add Member", message: "Select a household first."}});
      return;
    }
    if (!this.membertoadd?.id) {
      this.dg.open(MessageComponent, {width: "500px",
        data: {heading: "Add Member", message: "Choose a citizen to add."}});
      return;
    }

    const confirm = this.dg.open(ConfirmComponent, {width: "500px",
      data: {heading: "Confirmation - Add Member",
             message: "Add " + this.membertoadd.name + " to household " + this.household.householdno + "?"}});

    confirm.afterClosed().subscribe(result => {
      if (!result) { return; }
      this.hhs.addMember(this.household.id, this.membertoadd.id)
        .then((response: any) => {
          const errors = response ? response["errors"] : "Server Not Found";
          if (errors) {
            this.dg.open(MessageComponent, {width: "500px",
              data: {heading: "Add Member", message: errors}});
            return;
          }
          this.membertoadd = null;
          this.reloadSelectedHousehold();
          this.dg.open(MessageComponent, {width: "500px",
            data: {heading: "Add Member", message: "Member added successfully."}});
        })
        .catch((error: any) => {
          this.dg.open(MessageComponent, {width: "500px",
            data: {heading: "Add Member",
                   message: error?.error?.errors || error?.error?.message || error?.message || "Could not add the member."}});
        });
    });
  }

  removeMember(citizen: Citizen): void {
    if (!this.household?.id || !citizen?.id) { return; }

    const confirm = this.dg.open(ConfirmComponent, {width: "500px",
      data: {heading: "Confirmation - Remove Member",
             message: "Remove " + citizen.name + " from household " + this.household.householdno + "?"
                        + (citizen.id === this.household.headcitizenId
                            ? "<br><br><strong>This citizen is the head of the household.</strong> "
                              + "Removing them leaves the household without a head until you choose a new one."
                            : "")}});

    confirm.afterClosed().subscribe(result => {
      if (!result) { return; }
      this.hhs.removeMember(this.household.id, citizen.id)
        .then((response: any) => {
          const errors = response ? response["errors"] : "Server Not Found";
          if (errors) {
            this.dg.open(MessageComponent, {width: "500px",
              data: {heading: "Remove Member", message: errors}});
            return;
          }
          this.reloadSelectedHousehold();
        })
        .catch((error: any) => {
          this.dg.open(MessageComponent, {width: "500px",
            data: {heading: "Remove Member",
                   message: error?.error?.errors || error?.error?.message || error?.message || "Could not remove the member."}});
        });
    });
  }

  /** Members of this household, plus whoever is currently head even if they are
   *  not a member yet - otherwise the select renders blank on an existing record. */
  get headCandidates(): Citizen[] {
    if (!this.members || this.members.length === 0) { return this.citizens ?? []; }
    const list = [...this.members];
    const headId = this.household?.headcitizenId;
    if (headId && !list.some(c => c.id === headId)) {
      const head = (this.citizens ?? []).find(c => c.id === headId);
      if (head) { list.push(head); }
    }
    return list;
  }
}
