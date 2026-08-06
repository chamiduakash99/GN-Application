import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Citizenskill} from '../../../entity/Citizenskill';
import {Income} from '../../../entity/Income';
import {Profession} from '../../../entity/Profession';
import {Citizen} from '../../../entity/Citizen';

import {CitizenskillService} from '../../../service/CitizenskillService';
import {IncomeService} from '../../../service/IncomeService';
import {ProfessionService} from '../../../service/ProfessionService';
import {CitizenService} from '../../../service/CitizenService';
import {AuthorizationManager} from '../../../service/authorizationmanager';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

@Component({
  selector: 'app-citizenskill',
  templateUrl: './citizenskill.component.html',
  styleUrls: ['./citizenskill.component.css']
})
export class CitizenskillComponent implements OnInit {

  // ── Citizen table (top) ────────────────────────────────────────────────────
  citcolumns: string[] = ['name', 'nic', 'mobileno', 'email', 'skillcount', 'hasincome'];
  citheaders: string[] = ['Name', 'NIC', 'Mobile', 'Email', 'Skills', 'Income'];

  cscitcolumns: string[] = ['csname', 'csnic', 'csmobile', 'csemail', 'csskills', 'csincome'];
  cscitprompts: string[] = ['Search Name', 'Search NIC', 'Search Mobile', 'Search Email', 'Search Skills', 'Income?'];

  citizens: Citizen[] = [];
  citdata!: MatTableDataSource<Citizen>;
  selectedcitizen: Citizen | null = null;

  @ViewChild('citpaginator') citpaginator!: MatPaginator;

  // ── Skill table (bottom left) ──────────────────────────────────────────────
  skillcolumns: string[] = ['profession', 'experienceyears', 'skillmodi'];
  skillheaders: string[] = ['Profession', 'Experience (Years)', 'Modification'];
  skillbinders: string[] = ['profession.name', 'experienceyears', 'getSkillModi()'];

  csskillcolumns: string[] = ['csprofession', 'csexperience', 'csskillmodi'];
  csskillprompts: string[] = ['Search Profession', 'Search Years', 'Search'];

  skills: Citizenskill[] = [];
  skilldata!: MatTableDataSource<Citizenskill>;
  selectedskill: Citizenskill | null = null;
  selectedskillrow: any;

  @ViewChild('skillpaginator') skillpaginator!: MatPaginator;

  // ── Forms ──────────────────────────────────────────────────────────────────
  cssearch!: FormGroup;
  sssearch!: FormGroup;
  cscitsearch!: FormGroup;
  csskillsearch!: FormGroup;
  skillform!: FormGroup;
  incomeform!: FormGroup;

  // ── Income ─────────────────────────────────────────────────────────────────
  income: Income | null = null;
  oldincome: Income | null = null;

  // ── Lookups ────────────────────────────────────────────────────────────────
  professions: Profession[] = [];

  imageurl: string = '';

  // ── Button states ──────────────────────────────────────────────────────────
  enaskilladd: boolean = false;
  enaskillupd: boolean = false;
  enaskilldel: boolean = false;

  enaincomeadd: boolean = false;
  enaincomeupd: boolean = false;
  enaincomedel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  uiassist: UiAssist;

  constructor(
    private css2: CitizenskillService,
    private is: IncomeService,
    private ps: ProfessionService,
    private cits: CitizenService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    // Server-side search form
    this.sssearch = this.fb.group({
      'sscitizens':   new FormControl(),
      'ssprofession': new FormControl(),
      'ssincomesrc':  new FormControl(),
      'ssminamount':  new FormControl(),
      'ssmaxamount':  new FormControl(),
    });

    // Client-side search — citizen table
    this.cscitsearch = this.fb.group({
      'csname':   new FormControl(),
      'csnic':    new FormControl(),
      'csmobile': new FormControl(),
      'csemail':  new FormControl(),
      'csskills': new FormControl(),
      'csincome': new FormControl(),
    });

    // Client-side search — skill table
    this.csskillsearch = this.fb.group({
      'csprofession': new FormControl(),
      'csexperience': new FormControl(),
      'csskillmodi':  new FormControl(),
    });

    // Skill form
    this.skillform = this.fb.group({
      'profession':     new FormControl('', [Validators.required]),
      'experienceyears':new FormControl('', [Validators.required, Validators.min(1)]),
    }, {updateOn: 'change'});

    // Income form
    this.incomeform = this.fb.group({
      'monthlyaverageincome': new FormControl('', [Validators.required, Validators.min(0)]),
      'incomesource':         new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.imageurl = 'assets/pending.gif';
    this.loadCitizenTable('');
    this.ps.getAllList().then(res => this.professions = res);
    this.skills = [];
    this.skilldata = new MatTableDataSource(this.skills);

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'citizenskill' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'citizenskill' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'citizenskill' && authority.operation === 'delete');
  }

  // ── Citizen table loader ───────────────────────────────────────────────────
  loadCitizenTable(query: string): void {
    this.cits.getAll(query)
      .then((items: Citizen[]) => {
        this.citizens = items;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch(error => { console.log(error); this.imageurl = 'assets/rejected.png'; })
      .finally(() => {
        this.citdata = new MatTableDataSource(this.citizens);
        this.citdata.paginator = this.citpaginator;
      });
  }

  // ── Skills table loader ────────────────────────────────────────────────────
  loadSkillTable(citizenId: number): void {
    this.css2.getAll('?citizenid=' + citizenId)
      .then((items: Citizenskill[]) => { this.skills = items; })
      .catch(error => console.log(error))
      .finally(() => {
        this.skilldata = new MatTableDataSource(this.skills);
        this.skilldata.paginator = this.skillpaginator;
      });
  }

  // ── Income loader for citizen ──────────────────────────────────────────────
  loadIncome(citizenId: number): void {
    this.is.getByCitizen(citizenId).then((inc: Income | null) => {
      this.income    = inc;
      this.oldincome = inc ? JSON.parse(JSON.stringify(inc)) : null;

      if (inc) {
        this.incomeform.patchValue(inc);
        this.enaincomeadd = false;
        this.enaincomeupd = true;
        this.enaincomedel = true;
      } else {
        this.incomeform.reset();
        this.enaincomeadd = true;
        this.enaincomeupd = false;
        this.enaincomedel = false;
      }
      this.incomeform.markAsPristine();
    });
  }

  // ── Table helpers ──────────────────────────────────────────────────────────
  getSkillModi(element: Citizenskill): string {
    return element.profession?.name + ' (' + element.experienceyears + ' yrs)';
  }

  getSkillCount(citizen: Citizen): number {
    // Count from loaded skills when citizen is selected, else show –
    if (this.selectedcitizen?.id === citizen.id) return this.skills.length;
    return 0;
  }

  // ── Client-side filters ────────────────────────────────────────────────────
  filterCitizenTable(): void {
    const cs = this.cscitsearch.getRawValue();
    this.citdata.filterPredicate = (c: Citizen) => {
      return (cs.csname   == null || c.name?.toLowerCase().includes((cs.csname ?? '').toLowerCase())) &&
        (cs.csnic    == null || (c.nic ?? '').toLowerCase().includes((cs.csnic ?? '').toLowerCase())) &&
        (cs.csmobile == null || (c.mobileno ?? '').includes((cs.csmobile ?? '').toLowerCase())) &&
        (cs.csemail  == null || (c.email ?? '').toLowerCase().includes((cs.csemail ?? '').toLowerCase()));
    };
    this.citdata.filter = 'xx';
  }

  filterSkillTable(): void {
    const cs = this.csskillsearch.getRawValue();
    this.skilldata.filterPredicate = (s: Citizenskill) => {
      return (cs.csprofession == null || s.profession?.name.toLowerCase().includes((cs.csprofession ?? '').toLowerCase())) &&
        (cs.csexperience == null || String(s.experienceyears).includes((cs.csexperience ?? '').toLowerCase()));
    };
    this.skilldata.filter = 'xx';
  }

  // ── Server-side search ─────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.sssearch.getRawValue();
    let query = '';
    if (ss.sscitizens   != null) query += '&citizenid='    + ss.sscitizens;
    if (ss.ssprofession != null) query += '&professionid=' + ss.ssprofession;
    if (query !== '')            query  = query.replace(/^./, '?');
    this.loadCitizenTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) { this.sssearch.reset(); this.loadCitizenTable(''); }
    });
  }

  // ── Select citizen from table ──────────────────────────────────────────────
  selectCitizen(c: Citizen): void {
    this.selectedcitizen   = c;
    this.selectedskill     = null;
    this.selectedskillrow  = null;

    this.skillform.reset();
    this.incomeform.reset();

    this.loadSkillTable(c.id);
    this.loadIncome(c.id);

    this.enaskilladd = true;
    this.enaskillupd = false;
    this.enaskilldel = false;
  }

  // ── Select skill from table ────────────────────────────────────────────────
  selectSkill(s: Citizenskill): void {
    this.selectedskillrow = s;
    this.selectedskill    = JSON.parse(JSON.stringify(s));

    // @ts-ignore
    this.selectedskill.profession = (this.professions ?? []).find(p => p.id === s.profession.id);

    if (this.selectedskill) {
      this.skillform.patchValue(this.selectedskill);
    }
    // this.skillform.patchValue(this.selectedskill);
    this.skillform.markAsPristine();

    this.enaskilladd = false;
    this.enaskillupd = true;
    this.enaskilldel = true;
  }

  // ── Errors ─────────────────────────────────────────────────────────────────
  getSkillErrors(): string {
    let errors = '';
    for (const name in this.skillform.controls) {
      if (this.skillform.controls[name].errors)
        errors += '<br>Invalid ' + name.charAt(0).toUpperCase() + name.slice(1);
    }
    return errors;
  }

  getIncomeErrors(): string {
    let errors = '';
    for (const name in this.incomeform.controls) {
      if (this.incomeform.controls[name].errors)
        errors += '<br>Invalid ' + name.charAt(0).toUpperCase() + name.slice(1);
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
        this.skillform.reset();
        this.incomeform.reset();
        this.selectedcitizen  = null;
        this.selectedskill    = null;
        this.selectedskillrow = null;
        this.income           = null;
        this.skills           = [];
        this.skilldata        = new MatTableDataSource(this.skills);
        this.enaskilladd = false; this.enaskillupd = false; this.enaskilldel = false;
        this.enaincomeadd = false; this.enaincomeupd = false; this.enaincomedel = false;
        this.loadCitizenTable('');
      }
    });
  }

  // ════════════════════════════════════════════════════════
  // SKILL CRUD
  // ════════════════════════════════════════════════════════

  addSkill(): void {
    const errors = this.getSkillErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Add Skill', message: errors}});
      return;
    }
    if (!this.selectedcitizen) return;

    const raw = this.skillform.getRawValue();
    const skill: Citizenskill = {
      id: 0,
      profession:     raw.profession,
      experienceyears:raw.experienceyears,
      citizen:        {id: this.selectedcitizen.id} as Citizen,
    };

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Add Skill',
        message: `Add <strong>${skill.profession?.name}</strong> (${skill.experienceyears} yrs) for ${this.selectedcitizen.name}?`}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.css2.add(skill).then((res: [] | undefined) => {
          if (res != undefined) {
            // @ts-ignore
            status = res['errors'] == ''; if (!status) message = res['errors'];
          } else { status = false; message = 'Content Not Found'; }
        })
        .catch((error: any) => {
          status = false;
          message = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (status) {
            message = 'Skill Added Successfully';
            this.skillform.reset();
            this.loadSkillTable(this.selectedcitizen!.id);
            this.enaskilladd = true; this.enaskillupd = false; this.enaskilldel = false;
            this.selectedskillrow = null;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Add Skill', message}});
        });
      }
    });
  }

  updateSkill(): void {
    const errors = this.getSkillErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Update Skill', message: errors}});
      return;
    }

    const raw  = this.skillform.getRawValue();
    const skill: Citizenskill = {
      id:              this.selectedskill!.id,
      profession:      raw.profession,
      experienceyears: raw.experienceyears,
      citizen:         {id: this.selectedcitizen!.id} as Citizen,
    };

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Update Skill', message: 'Are you sure to Update this Skill?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.css2.update(skill).then((res: [] | undefined) => {
          if (res != undefined) {
            // @ts-ignore
            status = res['errors'] == ''; if (!status) message = res['errors'];
          } else { status = false; message = 'Content Not Found'; }
        })
        .catch((error: any) => {
          status = false;
          message = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (status) {
            message = 'Skill Updated Successfully';
            this.skillform.reset();
            this.loadSkillTable(this.selectedcitizen!.id);
            this.enaskilladd = true; this.enaskillupd = false; this.enaskilldel = false;
            this.selectedskillrow = null;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Update Skill', message}});
        });
      }
    });
  }

  deleteSkill(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Delete Skill',
        message: `Remove <strong>${this.selectedskill?.profession?.name}</strong> skill from ${this.selectedcitizen?.name}?`}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.css2.delete(this.selectedskill!.id).then((res: [] | undefined) => {
          if (res != undefined) {
            // @ts-ignore
            status = res['errors'] == ''; if (!status) message = res['errors'];
          } else { status = false; message = 'Content Not Found'; }
        })
        .catch((error: any) => {
          status = false;
          message = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (status) {
            message = 'Skill Deleted Successfully';
            this.skillform.reset();
            this.loadSkillTable(this.selectedcitizen!.id);
            this.enaskilladd = true; this.enaskillupd = false; this.enaskilldel = false;
            this.selectedskillrow = null; this.selectedskill = null;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Delete Skill', message}});
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════
  // INCOME CRUD
  // ════════════════════════════════════════════════════════

  addIncome(): void {
    const errors = this.getIncomeErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Add Income', message: errors}});
      return;
    }
    if (!this.selectedcitizen) return;

    const raw = this.incomeform.getRawValue();
    const newIncome: Income = {
      id: 0,
      monthlyaverageincome: raw.monthlyaverageincome,
      incomesource:         raw.incomesource,
      citizen:              {id: this.selectedcitizen.id} as Citizen,
    };

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Add Income',
        message: `Add income record for <strong>${this.selectedcitizen.name}</strong>?<br>Monthly: Rs. ${raw.monthlyaverageincome}<br>Source: ${raw.incomesource}`}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.is.add(newIncome).then((res: [] | undefined) => {
          if (res != undefined) {
            // @ts-ignore
            status = res['errors'] == ''; if (!status) message = res['errors'];
          } else { status = false; message = 'Content Not Found'; }
        })
        .catch((error: any) => {
          status = false;
          message = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (status) {
            message = 'Income Record Added Successfully';
            this.loadIncome(this.selectedcitizen!.id);
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Add Income', message}});
        });
      }
    });
  }

  updateIncome(): void {
    const errors = this.getIncomeErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Update Income', message: errors}});
      return;
    }

    const raw = this.incomeform.getRawValue();
    const updIncome: Income = {
      id:                   this.oldincome!.id,
      monthlyaverageincome: raw.monthlyaverageincome,
      incomesource:         raw.incomesource,
      citizen:              {id: this.selectedcitizen!.id} as Citizen,
    };

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Update Income', message: 'Are you sure to Update this Income Record?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.is.update(updIncome).then((res: [] | undefined) => {
          if (res != undefined) {
            // @ts-ignore
            status = res['errors'] == ''; if (!status) message = res['errors'];
          } else { status = false; message = 'Content Not Found'; }
        })
        .catch((error: any) => {
          status = false;
          message = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (status) {
            message = 'Income Record Updated Successfully';
            this.loadIncome(this.selectedcitizen!.id);
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Update Income', message}});
        });
      }
    });
  }

  deleteIncome(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Delete Income',
        message: `Remove income record for <strong>${this.selectedcitizen?.name}</strong>?`}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.is.delete(this.oldincome!.id).then((res: [] | undefined) => {
          if (res != undefined) {
            // @ts-ignore
            status = res['errors'] == ''; if (!status) message = res['errors'];
          } else { status = false; message = 'Content Not Found'; }
        })
        .catch((error: any) => {
          status = false;
          message = error?.error?.errors || error?.error?.message || error?.message || ('Request failed with status ' + error?.status);
          console.error('API error:', error);
        })
        .finally(() => {
          if (status) {
            message = 'Income Record Deleted Successfully';
            this.loadIncome(this.selectedcitizen!.id);
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Delete Income', message}});
        });
      }
    });
  }
}
