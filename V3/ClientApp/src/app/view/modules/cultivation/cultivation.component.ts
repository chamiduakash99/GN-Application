import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {Cultivation} from '../../../entity/Cultivation';
import {Harvest} from '../../../entity/Harvest';
import {Croptype} from '../../../entity/Croptype';
import {Cultivationstatus} from '../../../entity/Cultivationstatus';
import {Areaunit} from '../../../entity/Areaunit';
import {Land} from '../../../entity/Land';
import {Citizen} from '../../../entity/Citizen';

import {CultivationService} from '../../../service/CultivationService';
import {HarvestService} from '../../../service/HarvestService';
import {CroptypeService} from '../../../service/CroptypeService';
import {CultivationstatusService} from '../../../service/CultivationstatusService';
import {AreaunitService} from '../../../service/AreaunitService';
import {CitizenService} from '../../../service/CitizenService';
import {LandService} from '../../../service/land.service';
import {AuthorizationManager} from '../../../service/authorizationmanager';

import {UiAssist} from '../../../util/ui/ui.assist';
import {MessageComponent} from '../../../util/dialog/message/message.component';
import {ConfirmComponent} from '../../../util/dialog/confirm/confirm.component';

// You will need a LanddetailService already in your project
// import {LanddetailService} from '../../../service/LanddetailService';

@Component({
  selector: 'app-cultivation',
  templateUrl: './cultivation.component.html',
  styleUrls: ['./cultivation.component.css']
})
export class CultivationComponent implements OnInit {

  // ── Cultivation table ──────────────────────────────────────────────────────
  culcolumns: string[] = ['cultivationno', 'citizen', 'land', 'croptype', 'status', 'plantingdate', 'expectedharvestdate'];
  culheaders: string[] = ['Cultivation No', 'Farmer', 'Land', 'Crop', 'Status', 'Planted', 'Expected Harvest'];
  culbinders: string[] = ['cultivationno', 'citizen.name', 'landdetail.deedno', 'croptype.name', 'cultivationstatus.name', 'plantingdate', 'expectedharvestdate'];

  csculcolumns: string[] = ['csculno', 'csfarmer', 'csland', 'cscrop', 'csstatus', 'csplant', 'csexpected'];
  csculprompts: string[] = ['Search No', 'Search Farmer', 'Search Land', 'Search Crop', 'Search Status', 'Search Planted', 'Search Expected'];

  // ── Harvest table ──────────────────────────────────────────────────────────
  harcolumns: string[] = ['harvestdate', 'quantity', 'qualityremarks', 'harmodi'];
  harheaders: string[] = ['Harvest Date', 'Quantity', 'Quality / Remarks', 'Modification'];
  harbinders: string[] = ['harvestdate', 'quantity', 'qualityremarks', 'getHarModi()'];

  csharcolumns: string[] = ['cshardate', 'csqty', 'csquality'];
  csharprompts: string[] = ['Search Date', 'Search Qty', 'Search Quality'];

  // ── Forms ──────────────────────────────────────────────────────────────────
  cssearch!: FormGroup;
  sssearch!: FormGroup;
  culform!: FormGroup;
  csharform!: FormGroup;
  harform!: FormGroup;

  // ── Data ───────────────────────────────────────────────────────────────────
  cultivation!: Cultivation;
  oldcultivation!: Cultivation;
  harvest!: Harvest;
  oldharvest!: Harvest;

  selectedculrow: any;
  selectedharrow: any;

  cultivations: Cultivation[] = [];
  culdata!: MatTableDataSource<Cultivation>;

  harvests: Harvest[] = [];
  hardata!: MatTableDataSource<Harvest>;

  croptypes: Croptype[] = [];
  cultivationstatuses: Cultivationstatus[] = [];
  areaunits: Areaunit[] = [];
  landdetails: Land[] = [];
  citizens: Citizen[] = [];
  statusSummary: Array<{status: string, count: number}> = [];

  imageurl: string = '';

  @ViewChild('culpaginator') culpaginator!: MatPaginator;
  @ViewChild('harpaginator') harpaginator!: MatPaginator;

  // ── Button states ──────────────────────────────────────────────────────────
  enaculadd: boolean = true;
  enaculupd: boolean = false;
  enaculdel: boolean = false;

  enaharadd: boolean = false;
  enaharupd: boolean = false;
  enahardel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  uiassist: UiAssist;

  constructor(
    private culs: CultivationService,
    private hars: HarvestService,
    private cts: CroptypeService,
    private css2: CultivationstatusService,
    private aus: AreaunitService,
    private cits: CitizenService,
    private lds: LandService,
    private fb: FormBuilder,
    private dg: MatDialog,
    public authService: AuthorizationManager,
  ) {
    this.uiassist = new UiAssist(this);

    // Client-side search — cultivation
    this.cssearch = this.fb.group({
      'csculno':   new FormControl(),
      'csfarmer':  new FormControl(),
      'csland':    new FormControl(),
      'cscrop':    new FormControl(),
      'csstatus':  new FormControl(),
      'csplant':   new FormControl(),
      'csexpected':new FormControl(),
      'csmodi':    new FormControl(),
    });

    // Server-side search
    this.sssearch = this.fb.group({
      'sscitizens':  new FormControl(),
      'ssstatus':    new FormControl(),
      'sscroptype':  new FormControl(),
      'sslanddetail':new FormControl(),
    });

    // Cultivation form
    this.culform = this.fb.group({
      'cultivationno':       new FormControl('', [Validators.required]),
      'citizen':             new FormControl('', [Validators.required]),
      'landdetail':          new FormControl('', [Validators.required]),
      'croptype':            new FormControl('', [Validators.required]),
      'cultivationstatus':   new FormControl(null),
      'areaunit':            new FormControl('', [Validators.required]),
      'cultivatedarea':      new FormControl('', [Validators.required, Validators.min(0)]),
      'plantingdate':        new FormControl('', [Validators.required]),
      'expectedharvestdate': new FormControl('', [Validators.required]),
      'remarks':             new FormControl(''),
    }, {updateOn: 'change'});

    // Client-side search — harvest
    this.csharform = this.fb.group({
      'cshardate': new FormControl(),
      'csqty':     new FormControl(),
      'csquality': new FormControl(),
    });

    // Harvest form
    this.harform = this.fb.group({
      'harvestdate':    new FormControl('', [Validators.required]),
      'quantity':       new FormControl('', [Validators.required]),
      'qualityremarks': new FormControl(''),
      'cultivation':    new FormControl(''),
    }, {updateOn: 'change'});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.imageurl = 'assets/pending.gif';
    this.loadCultivationTable('');
    this.harvests = [];
    this.hardata  = new MatTableDataSource(this.harvests);

    this.cts.getAllList().then(res  => this.croptypes = res);
    this.css2.getAllList().then(res => this.cultivationstatuses = res);
    this.aus.getAllList().then(res  => this.areaunits = res);
    this.cits.getAllListNameId().then(res => this.citizens = res);
    this.lds.getAllListNameId().then((res: Land[]) => this.landdetails = res);

    this.enableHarButtons(false, false, false);

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  updateStatusSummary(): void {
    this.statusSummary = [
      { status: 'Active', count: this.cultivations.filter(c => c.cultivationstatus?.name === 'Active').length },
      { status: 'Harvested', count: this.cultivations.filter(c => c.cultivationstatus?.name === 'Harvested').length },
      { status: 'Abandoned', count: this.cultivations.filter(c => c.cultivationstatus?.name === 'Abandoned').length },
      { status: 'Total Cultivations', count: this.cultivations.length },
    ];
  }

  // ── Table loaders ──────────────────────────────────────────────────────────
  loadCultivationTable(query: string): void {
    this.culs.getAll(query)
      .then((items: Cultivation[]) => {
        this.cultivations = items;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch(error => { console.log(error); this.imageurl = 'assets/rejected.png'; })
      .finally(() => {
        this.culdata = new MatTableDataSource(this.cultivations);
        this.culdata.paginator = this.culpaginator;
        this.updateStatusSummary();
      });
  }

  loadHarvestTable(cultivationId: number): void {
    this.hars.getAll('?cultivationid=' + cultivationId)
      .then((items: Harvest[]) => { this.harvests = items; })
      .catch(error => console.log(error))
      .finally(() => {
        this.hardata = new MatTableDataSource(this.harvests);
        this.hardata.paginator = this.harpaginator;
      });
  }

  // ── Table helpers ──────────────────────────────────────────────────────────
  getModi(element: Cultivation): string {
    return element.cultivationno + ' (' + element.croptype?.name + ')';
  }

  getHarModi(element: Harvest): string {
    return element.quantity + ' kg — ' + (element.qualityremarks ?? '');
  }

  // ── Crop type hint ─────────────────────────────────────────────────────────
  get selectedCroptypeHint(): string {
    const ct: Croptype = this.culform.get('croptype')?.value;
    if (!ct || !ct.growthperioddays) return '';
    return `Growth period: ~${ct.growthperioddays} days`;
  }

  // ── Button state helpers ───────────────────────────────────────────────────
  enableHarButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaharadd = add;
    this.enaharupd = upd;
    this.enahardel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'cultivation' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'cultivation' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'cultivation' && authority.operation === 'delete');
  }

  // ── Client-side filters ────────────────────────────────────────────────────
  filterCultivationTable(): void {
    const cs = this.cssearch.getRawValue();
    this.culdata.filterPredicate = (c: Cultivation) => {
      return (cs.csculno   == null || c.cultivationno?.toLowerCase().includes((cs.csculno ?? '').toLowerCase())) &&
        (cs.csfarmer  == null || c.citizen?.name.toLowerCase().includes((cs.csfarmer ?? '').toLowerCase())) &&
        (cs.csland    == null || (c.landdetail?.deedno ?? '').toLowerCase().includes((cs.csland ?? '').toLowerCase())) &&
        (cs.cscrop    == null || c.croptype?.name.toLowerCase().includes((cs.cscrop ?? '').toLowerCase())) &&
        (cs.csstatus  == null || c.cultivationstatus?.name.toLowerCase().includes(cs.csstatus.toLowerCase()));
    };
    this.culdata.filter = 'xx';
  }

  filterHarvestTable(): void {
    const cs = this.csharform.getRawValue();
    this.hardata.filterPredicate = (h: Harvest) => {
      return (cs.cshardate == null || h.harvestdate?.includes((cs.cshardate ?? '').toLowerCase())) &&
        (cs.csqty     == null || String(h.quantity).includes((cs.csqty ?? '').toLowerCase())) &&
        (cs.csquality == null || (h.qualityremarks ?? '').toLowerCase().includes((cs.csquality ?? '').toLowerCase()));
    };
    this.hardata.filter = 'xx';
  }

  // ── Server-side search ─────────────────────────────────────────────────────
  btnSearchMc(): void {
    const ss = this.sssearch.getRawValue();
    let query = '';
    if (ss.sscitizens   != null) query += '&citizenid='           + ss.sscitizens;
    if (ss.ssstatus     != null) query += '&cultivationstatusid=' + ss.ssstatus;
    if (ss.sscroptype   != null) query += '&croptypeid='          + ss.sscroptype;
    if (ss.sslanddetail != null) query += '&landdetailid='        + ss.sslanddetail;
    if (query !== '')            query  = query.replace(/^./, '?');
    this.loadCultivationTable(query);
  }

  btnSearchClearMc(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Search Clear', message: 'Are you sure to Clear the Search?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) { this.sssearch.reset(); this.loadCultivationTable(''); }
    });
  }

  // ── Fill cultivation form from row ─────────────────────────────────────────
  fillCulForm(c: Cultivation): void {
    this.selectedculrow  = c;
    this.cultivation     = JSON.parse(JSON.stringify(c));
    this.oldcultivation  = JSON.parse(JSON.stringify(c));

    // @ts-ignore
    this.cultivation.citizen           = (this.citizens ?? []).find(x => x.id === this.cultivation.citizen.id);
    // @ts-ignore
    this.cultivation.croptype          = (this.croptypes ?? []).find(x => x.id === this.cultivation.croptype.id);
    // @ts-ignore
    this.cultivation.cultivationstatus = (this.cultivationstatuses ?? []).find(x => x.id === this.cultivation.cultivationstatus.id) ?? null;
    // @ts-ignore
    this.cultivation.areaunit          = (this.areaunits ?? []).find(x => x.id === this.cultivation.areaunit.id);
    // @ts-ignore
    this.cultivation.landdetail        = (this.landdetails ?? []).find(x => x.id === this.cultivation.landdetail?.id) ?? null;

    this.culform.patchValue(this.cultivation);
    this.culform.markAsPristine();

    this.enaculadd = false;
    this.enaculupd = true;
    this.enaculdel = (c.cultivationstatus?.name === 'Active');

    // Load harvests for this cultivation
    this.loadHarvestTable(c.id);
    this.enableHarButtons(true, false, false);
    this.harform.reset();
    this.selectedharrow = null;
  }

  // ── Fill harvest form from row ─────────────────────────────────────────────
  fillHarForm(h: Harvest): void {
    this.selectedharrow = h;
    this.harvest        = JSON.parse(JSON.stringify(h));
    this.oldharvest     = JSON.parse(JSON.stringify(h));

    this.harform.patchValue(this.harvest);
    this.harform.markAsPristine();

    this.enableHarButtons(false, true, true);
  }

  // ── Errors ─────────────────────────────────────────────────────────────────
  getCulErrors(): string {
    let errors = '';
    for (const name in this.culform.controls) {
      if (this.culform.controls[name].errors)
        errors += '<br>Invalid ' + name.charAt(0).toUpperCase() + name.slice(1);
    }
    return errors;
  }

  getHarErrors(): string {
    let errors = '';
    for (const name in this.harform.controls) {
      if (this.harform.controls[name].errors)
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
        this.culform.reset();
        this.harform.reset();
        this.selectedculrow = null;
        this.selectedharrow = null;
        this.harvests = [];
        this.hardata  = new MatTableDataSource(this.harvests);
        this.enaculadd = true; this.enaculupd = false; this.enaculdel = false;
        this.enableHarButtons(false, false, false);
        this.loadCultivationTable('');
      }
    });
  }

  // ════════════════════════════════════════════════════════
  // CULTIVATION CRUD
  // ════════════════════════════════════════════════════════

  addCultivation(): void {
    const errors = this.getCulErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Add Cultivation', message: 'You have following Errors <br>' + errors}});
      return;
    }
    this.cultivation = this.culform.getRawValue();
    const info = '<br>No : ' + this.cultivation.cultivationno +
      '<br>Crop : ' + this.cultivation.croptype?.name +
      '<br>Area : ' + this.cultivation.cultivatedarea + ' ' + this.cultivation.areaunit?.name;

    const confirm = this.dg.open(ConfirmComponent, {width: '500px', data: {heading: 'Confirmation - Add Cultivation', message: 'Are you sure to Add: <br>' + info}});
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.culs.add(this.cultivation).then((res: [] | undefined) => {
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
          if (status) { message = 'Cultivation Added Successfully'; this.culform.reset(); this.loadCultivationTable(''); }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Add Cultivation', message}});
        });
      }
    });
  }

  updateCultivation(): void {
    const errors = this.getCulErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Update Cultivation', message: 'You have following Errors <br>' + errors}});
      return;
    }
    this.cultivation    = this.culform.getRawValue();
    this.cultivation.id = this.oldcultivation.id;

    const confirm = this.dg.open(ConfirmComponent, {width: '500px', data: {heading: 'Confirmation - Update Cultivation', message: 'Are you sure to Update this Cultivation?'}});
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.culs.update(this.cultivation).then((res: [] | undefined) => {
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
            message = 'Cultivation Updated Successfully';
            this.culform.reset(); this.loadCultivationTable('');
            this.harvests = []; this.hardata = new MatTableDataSource(this.harvests);
            this.enaculadd = true; this.enaculupd = false; this.enaculdel = false;
            this.enableHarButtons(false, false, false);
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Update Cultivation', message}});
        });
      }
    });
  }

  clearHarvest(): void {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: 'Confirmation - Clear', message: 'Are you sure to Clear the Harvest Details?'}
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.harform.reset();
        this.selectedharrow = null;
        this.enableHarButtons(true, false, false);   // ready for a new harvest entry against the still-selected cultivation
      }
    });
  }

  deleteCultivation(): void {
    const confirm = this.dg.open(ConfirmComponent, {width: '500px', data: {heading: 'Confirmation - Delete Cultivation', message: 'Are you sure to Delete this Cultivation? All harvest records will be affected.'}});
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.culs.delete(this.oldcultivation.id).then((res: [] | undefined) => {
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
            message = 'Cultivation Deleted Successfully';
            this.culform.reset(); this.loadCultivationTable('');
            this.harvests = []; this.hardata = new MatTableDataSource(this.harvests);
            this.enaculadd = true; this.enaculupd = false; this.enaculdel = false;
            this.enableHarButtons(false, false, false);
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Delete Cultivation', message}});
        });
      }
    });
  }

  // ════════════════════════════════════════════════════════
  // HARVEST CRUD
  // ════════════════════════════════════════════════════════

  addHarvest(): void {
    const errors = this.getHarErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Add Harvest', message: 'You have following Errors <br>' + errors}});
      return;
    }
    this.harvest = this.harform.getRawValue();
    // Link to selected cultivation
    this.harvest.cultivation = {id: this.cultivation.id} as Cultivation;

    const info = '<br>Date : ' + this.harvest.harvestdate + '<br>Quantity : ' + this.harvest.quantity;
    const confirm = this.dg.open(ConfirmComponent, {width: '500px', data: {heading: 'Confirmation - Add Harvest', message: 'Are you sure to Record this Harvest? <br>' + info}});
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.hars.add(this.harvest).then((res: [] | undefined) => {
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
            message = 'Harvest Recorded Successfully';
            this.harform.reset();
            this.loadHarvestTable(this.cultivation.id);
            this.enableHarButtons(true, false, false);
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Add Harvest', message}});
        });
      }
    });
  }

  updateHarvest(): void {
    const errors = this.getHarErrors();
    if (errors !== '') {
      this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Errors - Update Harvest', message: 'You have following Errors <br>' + errors}});
      return;
    }
    this.harvest    = this.harform.getRawValue();
    this.harvest.id = this.oldharvest.id;
    this.harvest.cultivation = {id: this.cultivation.id} as Cultivation;

    const confirm = this.dg.open(ConfirmComponent, {width: '500px', data: {heading: 'Confirmation - Update Harvest', message: 'Are you sure to Update this Harvest Record?'}});
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.hars.update(this.harvest).then((res: [] | undefined) => {
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
            message = 'Harvest Updated Successfully';
            this.harform.reset();
            this.loadHarvestTable(this.cultivation.id);
            this.enableHarButtons(true, false, false);
            this.selectedharrow = null;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Update Harvest', message}});
        });
      }
    });
  }

  deleteHarvest(): void {
    const confirm = this.dg.open(ConfirmComponent, {width: '500px', data: {heading: 'Confirmation - Delete Harvest', message: 'Are you sure to Delete this Harvest Record?'}});
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let status = false; let message = 'Server Not Found';
        this.hars.delete(this.oldharvest.id).then((res: [] | undefined) => {
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
            message = 'Harvest Deleted Successfully';
            this.harform.reset();
            this.loadHarvestTable(this.cultivation.id);
            this.enableHarButtons(true, false, false);
            this.selectedharrow = null;
          }
          this.dg.open(MessageComponent, {width: '500px', data: {heading: 'Status - Delete Harvest', message}});
        });
      }
    });
  }
}
