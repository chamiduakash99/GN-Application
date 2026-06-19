import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Street } from 'src/app/entity/Street';
import { Citizen } from 'src/app/entity/Citizen';
import { Building } from 'src/app/entity/Building';
import { Usage } from 'src/app/entity/usage';
import {Floortype } from 'src/app/entity/floortype';
import { StreetService } from 'src/app/service/StreetService';
import { CitizenService } from 'src/app/service/CitizenService';
import { AuthorizationManager } from 'src/app/service/authorizationmanager';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';
import { MatSelectChange } from '@angular/material/select';
import { Province } from 'src/app/entity/province';
import { District } from 'src/app/entity/district';
import { Division } from 'src/app/entity/division';
import { Gnd } from 'src/app/entity/gnd';
import { ProvinceService } from 'src/app/service/ProvinceService';
import { DistrictService } from 'src/app/service/DistrictService';
import { DivisionService } from 'src/app/service/DivisionService';
import { GndService } from 'src/app/service/GndService';
import {MatSelectionList} from "@angular/material/list";
import { Walltype } from 'src/app/entity/walltype';
import {FloortypeService} from "../../../service/floortype.service";
import {OwnershipType} from "../../../entity/ownershiptype";
import {OwnershipTypeService} from "../../../service/ownershiptype.service";
import {UsageService} from "../../../service/usage.service";
import {BuildingService} from "../../../service/building.service";
import { Land } from 'src/app/entity/Land';
import {Rooftype} from "../../../entity/rooftype";
import {Buildingtype} from "../../../entity/buildingtype";
import {RooftypeService} from "../../../service/rooftype.service";
import {WalltypeService} from "../../../service/walltype.service";

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
// export class BuildingComponent{}
export class BuildingComponent implements OnInit {

  // Table columns / headers / binders
  columns: string[] = [ 'usage', 'floortype', 'ownershiptype'];
  headers: string[] = [ 'Usage', 'Floor Type', 'Ownership Type'];
  binders: string[] = [ 'usage.name', 'floortype.name', 'ownershiptype.name'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  // public innerform!: FormGroup;

  building!: Building;
  oldbuilding!: Building;
  selectedrow: any;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  buildings: Array<Building> = [];
  streets: Array<Street> = [];
  citizens: Array<Citizen> = [];
  usages: Array<Usage> = [];
  floortypes: Array<Floortype> = [];
  ownershiptypes: Array<OwnershipType> = [];
  walltypes: Array<Walltype> = [];
  lands: Array<Land> = [];
  buildingtypes: Array<Buildingtype> = [];
  rooftypes: Array<Rooftype> = [];

  provinces: Array<Province> = [];
  extprovinces: Array<Province> = [];
  districts: Array<District> = [];
  extdistricts: Array<District> = [];
  divisions: Array<Division> = [];
  extdivisions: Array<Division> = [];
  gnds: Array<Gnd> = [];
  extgnds: Array<Gnd> = [];

  data!: MatTableDataSource<Building>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  imagebuildingurl: string = 'assets/default2.png';

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  uiassist: UiAssist;
  minDate: Date;
  maxDate: Date;

  constructor(
    private ps: ProvinceService,
    private ds: DistrictService,
    private dvs: DivisionService,
    private gs: GndService,
    private ss: StreetService,
    private cs: CitizenService,
    private bs: BuildingService,
    private us: UsageService,
    private fts: FloortypeService,
    private ots: OwnershipTypeService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private rt: RooftypeService,
    private dp: DatePipe,
    public authService: AuthorizationManager,
    private wt: WalltypeService,
  ) {

    // @ts-ignore
    this.building = new Building(
      0,
      // @ts-ignore
      new Street(),
      // @ts-ignore
      new Citizen(),
      // @ts-ignore
      new Usage(),
      // @ts-ignore
      new Floortype(),
      // @ts-ignore
      new Walltype(),
      // @ts-ignore
      new OwnershipType(),
      '',
      ''
    );

    this.csearch = this.fb.group({
      "cscitizen": new FormControl(),
      "csstreet": new FormControl(),
      "csusage": new FormControl(),
      "csfloortype": new FormControl(),
      "csownershiptype": new FormControl(),
      "cswalltype": new FormControl(),
      "csland": new FormControl(),
      "csno": new FormControl()
    });

    this.ssearch = this.fb.group({
      "ssstreet": new FormControl(),
      "sscitizen": new FormControl(),
      "ssusage": new FormControl(),
      "ssfloortype": new FormControl(),
      "ssownershiptype": new FormControl(),
      "sswalltype": new FormControl(),
      "ssland": new FormControl(),
      "ssno": new FormControl()
    });

    this.form = this.fb.group({
      street: new FormControl('', []),
      citizen: new FormControl('', []),
      usage: new FormControl('', []),
      floorType: new FormControl('', []),
      ownershipType: new FormControl('', []),
      image: new FormControl('', []),
      remarks: new FormControl('', []),
      walltype: new FormControl('', []),
      buildingType: new FormControl('', []),
      roofType: new FormControl('', []),
      no: new FormControl('', []),
      landDetail: new FormControl('', []),
    });

    // this.innerform = this.fb.group({
    //   province: new FormControl('', []),
    //   district: new FormControl('', []),
    //   division: new FormControl('', []),
    //   gnd: new FormControl('', []),
    //   street: new FormControl('', [])
    // });

    this.uiassist = new UiAssist(this);
    this.minDate = new Date();
    this.maxDate = new Date(new Date().setDate(new Date().getDate() + 30));
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();
    this.createForm();

    // Load reference lists
    this.ss.getAllListNameId().then((s: Street[]) => this.streets = s);
    this.cs.getAllListNameId().then((c: Citizen[]) => this.citizens = c);
    this.us.getAllListNameId().then((u: Usage[]) => this.usages = u);
    this.fts.getAllListNameId().then((f: Floortype[]) => this.floortypes = f);
    this.ots.getAllListNameId().then((o: OwnershipType[]) => this.ownershiptypes = o);
    this.rt.getAllListNameId().then((r: Rooftype[]) => this.rooftypes = r);

    this.ps.getAll().then((s: Province[]) => { this.provinces = s; this.extprovinces = s; });
    this.ds.getAll().then((s: District[]) => { this.districts = s; this.extdistricts = s; });
    this.dvs.getAll().then((s: Division[]) => { this.divisions = s; this.extdivisions = s; });
    this.gs.getAll().then((s: Gnd[]) => { this.gnds = s; this.extgnds = s; });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createForm(): void {

    // this.innerform.reset();

    // Track value changes to set dirty/pristine status (pattern same as Street)
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        if (['no'].includes(controlName)) {
          value = parseFloat(value);
        }

        // control.valueChanges.subscribe(value => {
        //   if (['latitude', 'longitude', 'size'].includes(controlName)) {
        //     value = parseFloat(value);
        //   }


        if (this.oldbuilding && control.valid) {
          // @ts-ignore
          if (value === this.oldbuilding[controlName]) {
            control.markAsPristine();
          } else {
            control.markAsDirty();
          }
        } else {
          control.markAsPristine();
        }
      });
    }

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]) {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'building' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'building' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'building' && authority.operation === 'delete');
  }

  loadTable(query: string) {

    this.bs.getAll(query)
      .then((blds: Building[]) => {
        this.buildings = blds;
        console.log(this.buildings);
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.buildings);
        this.data.paginator = this.paginator;
      });

  }

  fillForm(building: Building) {

    // Enable Update/Delete buttons, disable Add
    this.enableButtons(false, true, true);

    this.selectedrow = building;

    // Deep copy for comparison
    this.building = JSON.parse(JSON.stringify(building));
    this.oldbuilding = JSON.parse(JSON.stringify(building));
    console.log(this.building);

    // // ===== INNER FORM CASCADE =====
    // this.districts = this.extdistricts;
    // this.gnds = this.extgnds;
    // this.divisions = this.extdivisions;
    // this.streets = this.streets; // no extstreets defined → using same list
    //
    // // Extract hierarchy from street
    // const street = this.building?.street;
    // const gnd = street?.gnd;
    // const division = gnd?.division;
    // const district = division?.district;
    // const province = district?.province;
    //
    // console.log("START -", street, "-", gnd, "-", division);
    //
    // // Filter based on hierarchy
    // this.streets = this.streets.filter((s: Street) =>
    //   s.gnd && gnd && s.gnd.id === gnd.id
    // );
    //
    // this.gnds = this.gnds.filter((g: Gnd) =>
    //   g.division?.id === division?.id
    // );
    //
    // this.divisions = this.divisions.filter((d: Division) =>
    //   d.district?.id === district?.id
    // );
    //
    // this.districts = this.districts.filter((di: District) =>
    //   di.province?.id === province?.id
    // );
    //
    // // Find exact objects for dropdowns
    // const tempgnd = this.gnds.find(g => g.id === gnd?.id);
    // const tempdiv = this.divisions.find(dv => dv.id === division?.id);
    // const tempdit = this.districts.find(dt => dt.id === district?.id);
    // const temppv = this.provinces.find(p => p.id === province?.id);
    //
    // // Patch inner form
    // this.innerform.patchValue({
    //   province: temppv,
    //   district: tempdit,
    //   division: tempdiv,
    //   gnd: tempgnd,
    //   street: this.building.street
    // });

    // ===== LINK DROPDOWNS =====

    // @ts-ignore
    this.building.usage = this.usages.find(u => u.id === this.building.usage.id);

    // @ts-ignore
    this.building.floortype = this.floortypes.find(f => f.id === this.building.floortype.id);

    // @ts-ignore
    this.building.ownershiptype = this.ownershiptypes.find(o => o.id === this.building.ownershiptype.id);

    // @ts-ignore
    this.building.street = this.streets.find(s => s.id === this.building.street.id);

    // @ts-ignore
    this.building.citizen = this.citizens.find(c => c.id === this.building.citizen.id);

    // // ===== IMAGE HANDLING =====
    // if (this.building.image) {
    //   try {
    //     this.imageurl = atob(this.building.image as unknown as string);
    //   } catch (e) {}
    //   if (this.form.controls['image']) {
    //     this.form.controls['image'].clearValidators();
    //   }
    // } else {
    //   this.clearImage();
    // }

    // ===== PATCH MAIN FORM =====
    this.form.patchValue(this.building);
    this.form.markAsPristine();
  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: { heading: "Search Clear", message: "Are you sure to Clear the Search?" }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  btnSearchMc(): void {

    const ssearchdata = this.ssearch.getRawValue();

    let streetid = ssearchdata.ssstreet;
    let citizenid = ssearchdata.sscitizen;
    let usageid = ssearchdata.ssusage;
    let floortypeid = ssearchdata.ssfloortype;
    let ownershiptypeid = ssearchdata.ssownershiptype;

    let query = "";

    if (streetid != null && streetid !== "") query = query + "&street=" + streetid;
    if (citizenid != null && citizenid !== "") query = query + "&citizen=" + citizenid;
    if (usageid != null && usageid !== "") query = query + "&usage=" + usageid;
    if (floortypeid != null && floortypeid !== "") query = query + "&floortype=" + floortypeid;
    if (ownershiptypeid != null && ownershiptypeid !== "") query = query + "&ownershiptype=" + ownershiptypeid;

    if (query != "") query = query.replace(/^./, "?");

    console.log(query);
    this.loadTable(query);
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: { heading: "Errors - Building Add", message: "You have the following Errors <br> " + errors }
      });

      errmsg.afterClosed().subscribe(async result => {
        if (!result) return;
      });

    } else {

      this.building = this.form.getRawValue();

      // Convert image to base64 (Building has only one image)
      if (this.imageurl) {
        this.building.image = btoa(this.imageurl);
      }

      // ===== DATA PREVIEW FOR CONFIRMATION =====
      let buildingdata: string = "";
      // buildingdata += "<br>Street : " + (this.building.street ? this.building.street.fullname : '');
      // buildingdata += "<br>Citizen : " + (this.building.citizen ? this.building.citizen.name : '');
      buildingdata += "<br>Usage : " + (this.building.usage ? this.building.usage.name : '');
      buildingdata += "<br>Floor Type : " + (this.building.floortype ? this.building.floortype.name : '');
      buildingdata += "<br>Ownership : " + (this.building.ownershiptype ? this.building.ownershiptype.name : '');

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Building Add",
          message: "Are you sure you want to add the following Building? <br><br>" + buildingdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.bs.add(this.building).then((response: any) => {

            if (response != undefined) {
              // @ts-ignore
              addstatus = response['errors'] == "";
              if (!addstatus) {
                // @ts-ignore
                addmessage = response['errors'];
              }
            } else {
              addstatus = false;
              addmessage = "Content Not Found";
            }

          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";

              this.form.reset();
              this.createForm();
              this.clearImage();
              Object.values(this.form.controls).forEach(control => control.markAsTouched());
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: { heading: "Status - Building Add", message: addmessage }
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result){
                return;
              }
            });
          });
        }
      });
    }
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      if (control.errors) {
        // if (this.regexes && this.regexes[controlName] != undefined) {
        //   errors = errors + "<br>" + this.regexes[controlName]['message'];
        // } else {
        //   errors = errors + "<br>Invalid " + controlName;
        // }
      }
    }

    return errors;
  }

  getUpdates(): string {

    let updates: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }

    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: { heading: "Errors - Building Update", message: "You have following Errors <br> " + errors }
      });

      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Building Update",
            message: "Are you sure to save the following updates? <br><br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {

          if (result) {

            // Get form values
            this.building = this.form.getRawValue();

            // Handle image (same logic as Land but only one image)
            if (this.form.controls['image'] && this.form.controls['image'].dirty) {
              this.building.image = btoa(this.imageurl);
            } else {
              this.building.image = this.oldbuilding.image;
            }

            // Keep same ID
            this.building.id = this.oldbuilding.id;

            // Call service (FIXED TYPE ISSUE HERE)
            this.bs.update(this.building).then((response: Building | undefined) => {

              if (response != undefined) {
                updstatus = true;
              } else {
                updstatus = false;
                updmessage = "Content Not Found";
              }

            }).finally(() => {

              if (updstatus) {
                updmessage = "Successfully Updated";

                this.form.reset();
                this.createForm();
                this.clearImage();

                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });

                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: { heading: "Status - Building Update", message: updmessage }
              });

              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });

          }

        });

      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: { heading: "Confirmation - Building Update", message: "Nothing Changed" }
        });

        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }
  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Building Delete",
        message: "Are you sure to delete the following Building? <br><br>" +
          (this.building && this.building.no ? this.building.no : '')
      }
    });

    confirm.afterClosed().subscribe(async result => {

      if (result) {

        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        // FIXED TYPE (no [] anymore)
        this.bs.delete(this.building.id).then((response: any ) => {

          if (response != undefined) {
            delstatus = true;
          } else {
            delstatus = false;
            delmessage = "Content Not Found";
          }

        }).finally(() => {

          if (delstatus) {
            delmessage = "Successfully Deleted";

            this.form.reset();
            this.createForm();
            this.clearImage();   // only image (no deed in Building)

            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });

            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: { heading: "Status - Building Delete", message: delmessage }
          });

          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });

      }

    });
  }

  clear(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Building Clear",
        message: "Are you sure to clear the following details? <br><br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {

      if (result) {

        // reset form
        this.form.reset();
        this.createForm();

        // reset selected row
        this.selectedrow = null;

        // reset building object safely (NO constructors)
        this.building = {
          id: 0,
          street: null,
          citizen: null,
          usage: null,
          floorType: null,
          walltype: null,
          ownershipType: null,
          image: "",
          remarks: ""
        } as any;

        // reset inner form (cascade form)
        // this.innerform.reset();

        // reset lists if needed
        this.districts = this.extdistricts;
        this.divisions = this.extdivisions;
        this.gnds = this.extgnds;

        // clear image preview (if you have function)
        this.clearImage();

        // mark controls clean
        Object.values(this.form.controls).forEach(control => {
          control.markAsPristine();
          control.markAsUntouched();
        });
      }
    });
  }

  clearImage(): void {
    this.imagebuildingurl = 'assets/default.png';
    if (this.form.controls['image']) this.form.controls['image'].setErrors({ 'required': true });
  }

  selectProvinceChange(event: MatSelectChange) {
    const prov = event.value as Province;
    this.districts = this.extdistricts.filter(d => d.province.id === prov.id);
  }

  selectDistrictChange(event: MatSelectChange) {
    const dist = event.value as District;
    this.divisions = this.extdivisions.filter(d => d.district.id === dist.id);
  }

  selectDivisionChange(event: MatSelectChange) {
    const div = event.value as Division;
    this.gnds = this.extgnds.filter(g => g.division.id === div.id);
  }


}
