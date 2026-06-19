import { DatePipe } from '@angular/common';
import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Land } from 'src/app/entity/Land';
import { Street } from 'src/app/entity/Street';
import { LandService } from 'src/app/service/LandService';
import { Landtype } from 'src/app/entity/Landtype';
import { Fencetype } from 'src/app/entity/Fencetype';
import { LandtypeService } from 'src/app/service/LandtypeService';
import { FencetypeService } from 'src/app/service/FencetypeService';
import { Citizen } from 'src/app/entity/Citizen';
import { CitizenService } from 'src/app/service/CitizenService';

import { District } from "../../../entity/district";
import { Division } from "../../../entity/division";
import { Province } from "../../../entity/province";
import { Gnd } from "../../../entity/gnd";
import { ProvinceService } from "../../../service/ProvinceService";
import { DistrictService } from "../../../service/DistrictService";
import { DivisionService } from "../../../service/DivisionService";
import { GndService } from "../../../service/GndService";

import { StreetService } from "../../../service/StreetService";
import { AuthorizationManager } from 'src/app/service/authorizationmanager';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';
import { MatSelectChange } from '@angular/material/select';
import {map, Observable, of, startWith} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {Userrole} from "../../../entity/userrole";
import {Landfeaturedetails} from "../../../entity/Landfeaturedetails";
import {LandfeatureService} from "../../../service/LandfeatureService";
import {Role} from "../../../entity/role";
import {Landfeature} from "../../../entity/Landfeature";
import {MatSelectionList} from "@angular/material/list";

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.css']
})
export class LandComponent implements OnInit{

  // Table columns / headers / binders (pattern similar to StreetComponent)
  columns: string[] = ['street', 'citizen', 'size', 'landtype', 'fencetype', 'remarks'];
  headers: string[] = ['Street', 'Citizen', 'Size (sq.m)', 'Land Type', 'Fence Type', 'Remarks'];
  binders: string[] = ['street.fullname', 'citizen.name', 'size', 'landtype.name', 'fencetype.name', 'remarks'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  land!: Land;
  oldland!: Land;
  selectedrow: any;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  lands: Array<Land> = [];
  landtypes: Array<Landtype> = [];
  fencetypes: Array<Fencetype> = [];
  citizens: Array<Citizen> = [];
  landfeaturedetailsList: Array<Landfeaturedetails> = [];

  streets: Array<Street> = [];

  provinces: Array<Province> = [];
  extprovinces: Array<Province> = [];

  districts: Array<District> = [];
  extdistricts: Array<District> = [];

  divisions: Array<Division> = [];
  extdivisions: Array<Division> = [];

  gnds: Array<Gnd> = [];
  extgnds: Array<Gnd> = [];

  extstreets: Array<Street> = [];
  extlandtypes: Array<Landtype> = [];
  extfencetypes: Array<Fencetype> = [];
  extcitizens: Array<Citizen> = [];

  @Input()landfeatures: Array<Landfeature> = [];
  oldlandfeatures:Array<Landfeature>=[];
  @Input()selectedlandfeatures: Array<Landfeature> =[];

  data!: MatTableDataSource<Land>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  imagelandurl: string = 'assets/default2.png';
  imagedeedurl: string = 'assets/default2.png';

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  regexes: any;

  uiassist: UiAssist;

  minDate: Date;
  maxDate: Date;
  // filteredStreet!: Observable<Street[]>;
  // streetControl = new FormControl('');

  constructor(
    private ps: ProvinceService,
    private ds: DistrictService,
    private dvs: DivisionService,
    private gs: GndService,

    private ss: StreetService,
    private lts: LandtypeService,
    private fts: FencetypeService,
    private cs: CitizenService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager,
    private ls: LandService,
    private lf: LandfeatureService
  ) {
    // @ts-ignore
    this.land = new Land(
      0,                      // id
      // @ts-ignore
      new Street(),                 // street (NOT null)
      0,                 // latitude
      0,                // longitude
      0,                   // size
      // @ts-ignore
      new Landtype(),               // landtype (NOT null)
      // @ts-ignore
      new Citizen(),                // citizen (NOT null)
      '',                     // image
      '',                     // deed
      // @ts-ignore
      new Fencetype(),              // fencetype (NOT null)
      '',                  // remarks
      new Array<Landfeaturedetails>      // landfeaturedetails
    );

    // search forms (pattern like street component)
    this.csearch = this.fb.group({
      "cscitizen": new FormControl(),
      "cssize": new FormControl(),
      "cslandtype": new FormControl(),
      "csfencetype": new FormControl(),
      "csstreet": new FormControl()
    });

    this.ssearch = this.fb.group({
      "ssstreet": new FormControl(),
      "sscitizen": new FormControl(),
      "sslandtype": new FormControl(),
      "ssfencetype": new FormControl(),
      "sslandfeature": new FormControl()
    });

    // main form fields (pattern same as street)
    this.form = this.fb.group({
      street: new FormControl('', []),
      citizen: new FormControl('', []),
      landtype: new FormControl('', []),
      fencetype: new FormControl('', []),
      latitude: new FormControl('', []),
      longitude: new FormControl('', []),
      size: new FormControl('', []),
      image: new FormControl('', []),
      deed: new FormControl('', []),
      remarks: new FormControl('', []),
      landfeaturedetails: new FormControl([])
    });

    // inner form cascade: province -> district -> division -> gnd
    this.innerform = this.fb.group({
      province: new FormControl('', []),
      district: new FormControl('', []),
      division: new FormControl('', []),
      gnd: new FormControl('', []),
      street: new FormControl('', [])
    });

    this.uiassist = new UiAssist(this);
    this.minDate = new Date(new Date().setDate(new Date().getDate() - 0));
    this.maxDate = new Date(new Date().setDate(new Date().getDate() + 13));
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();
    this.createForm();

    // load reference lists
    this.ss.getAllListNameId().then((ss: Street[]) => {
      this.streets = ss;
      // this.extstreets = this.streets;
    });

    this.lts.getAllListNameId().then((lts: Landtype[]) => {
      this.landtypes = lts;
      // this.extlandtypes = this.landtypes;
    });

    this.fts.getAllListNameId().then((fts: Fencetype[]) => {
      this.fencetypes = fts;
      // this.extfencetypes = this.fencetypes;
    });

    this.cs.getAllListNameId().then((cs: Citizen[]) => {
      this.citizens = cs;
      // this.extcitizens = this.citizens;
    });

    this.lf.getAllListNameId().then((lf: Landfeature[]) => {
      this.landfeatures = lf;
      this.oldlandfeatures = this.landfeatures;
      // this.extlandfeatures = this.landfeatures;
    });

    // provinces/districts/divisions/gnds
    this.ps.getAll().then((s: Province[]) => {
      this.provinces = s;
      this.extprovinces = this.provinces;
    });
    this.ds.getAll().then((s: District[]) => {
      this.districts = s;
      this.extdistricts = this.districts;
    });
    this.dvs.getAll().then((s: Division[]) => {
      this.divisions = s;
      this.extdivisions = this.divisions;
    });
    this.gs.getAll().then((s: Gnd[]) => {
      this.gnds = s;
      this.extgnds = this.gnds;
    });

    // streets list (for final tier of cascade)
    this.ss.getAllListNameId().then((sts: Street[]) => {
      this.streets = sts;
      this.extstreets = this.streets;
    });

    // regexes (if available) - same pattern as Street component (optional)
    // this.rs.get('land').then((regs: []) => {
    //   this.regexes = regs;
    //   // this.createForm(); // follow street pattern (don't re-create here)
    // });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createForm(): void {

    this.innerform.reset();

    // Track value changes to set dirty/pristine status (pattern same as Street)
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        if (['latitude', 'longitude', 'size'].includes(controlName)) {
          value = parseFloat(value);
        }

        if (this.oldland && control.valid) {
          // @ts-ignore
          if (value === this.oldland[controlName]) {
            control.markAsPristine();
          } else {
            control.markAsDirty();
          }
        } else {
          control.markAsPristine();
        }
      });
    }

    this.leftAll()
    // Enable Add button, disable update/delete by default
    this.enableButtons(true, false, false);
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

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'land' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'land' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'land' && authority.operation === 'delete');
  }

  loadTable(query: string) {

    this.ls.getAll(query)
      .then((lnds: Land[]) => {
        this.lands = lnds;
        console.log(this.lands)
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.lands);
        this.data.paginator = this.paginator;
      });

  }

  fillForm(land: Land) {

    // Enable Update/Delete buttons, disable Add
    this.enableButtons(false, true, true);

    this.selectedrow = land;

    // Deep copy of land for comparison
    this.land = JSON.parse(JSON.stringify(land));
    this.oldland = JSON.parse(JSON.stringify(land));
    console.log(this.land)

    // INNER FORM CHANGES (FILL INNER FORM) - 5-tier cascade: province -> district -> division -> gnd -> street
    this.districts = this.extdistricts;
    this.gnds = this.extgnds;
    this.divisions = this.extdivisions;
    this.streets = this.extstreets;

    // filter streets by GND as last tier
    for (const street of this.streets = this.streets.filter((s: Street) => {
      return s.gnd && this.land.street && s.gnd.id === this.land.street.gnd.id;
    })) {

    };
    const street = this.land?.street;
    const gnd = street?.gnd;
    const division = gnd?.division;
    const district = division?.district;
    const province = district?.province;
    console.log("START -",street,"-",gnd,"-",division)
    // Use street.gnd to derive the cascade (Solution 2 style)
    this.gnds = this.gnds.filter((g: Gnd) => g.division?.id === division?.id);

    this.divisions = this.divisions.filter((d: Division) => d.district?.id === district?.id);

    this.districts = this.districts.filter((di: District) => di.province?.id === province?.id);


    const tempgnd = this.gnds.find(g => g.id === gnd?.id);
    const tempdiv = this.divisions.find(dv => dv.id === division?.id);
    const tempdit = this.districts.find(dt => dt.id === district?.id);
    const temppv = this.provinces.find(p => p.id === province?.id);

    this.innerform.patchValue({
      province: temppv,
      district: tempdit,
      division: tempdiv,
      gnd: tempgnd,
      street: this.land.street
    });

    // this.innerform.patchValue({
    //   province: temppv || null,
    //   district: tempdit || null,
    //   division: tempdiv || null,
    //   gnd: tempgnd || null,
    //   street: street || null
    // });
    // Link select dropdowns for other refs
    // @ts-ignore
    this.land.landtype = this.landtypes.find(s => s.id === this.land.landtype.id);
    // @ts-ignore
    this.land.fencetype = this.fencetypes.find(s => s.id === this.land.fencetype.id);
    // // @ts-ignore
    // this.land.citizen = this.citizens.find(s => s.id === this.land.citizen.id);
    // @ts-ignore
    this.land.street = this.streets.find(s => s.id === this.land.street.id);

    this.landfeatures = this.oldlandfeatures;
    this.landfeaturedetailsList = this.land.landfeaturedetails;
    this.land.landfeaturedetails.forEach((lfd:Landfeaturedetails)=> this.landfeatures = this.landfeatures.filter((lf)=> lf.id != lfd.landfeature.id));
    // this.user.userroles.forEach((ur)=> this.roles = this.roles.filter((r)=> r.id != ur.role.id )); // Load or remove roles by comparing with user.userroles

    // If images exist on land, set previews
    if (this.land.image) {
      try {
        this.imagelandurl = atob(this.land.image as unknown as string);
      } catch (e) {
        // if not base64 or null, ignore
      }
      // clear validator for image if present
      if (this.form.controls['image']) this.form.controls['image'].clearValidators();
    } else {
      this.clearImage();
    }

    if (this.land.deed) {
      try {
        this.imagedeedurl = atob(this.land.deed as unknown as string);
      } catch (e) { }
      if (this.form.controls['deed']) this.form.controls['deed'].clearValidators();
    } else {
      this.clearDeed();
    }

    // Patch values to form
    this.form.patchValue(this.land);
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
    let landfeature = ssearchdata.sslandfeature;

    let streetid = ssearchdata.ssstreet;
    let citizenid = ssearchdata.sscitizen;
    let landtypeid = ssearchdata.sslandtype;
    let fencetypeid = ssearchdata.ssfencetype;

    let query = "";
    if (streetid != null && streetid !== "") query = query + "&/=" + landfeature;

    if (streetid != null && streetid !== "") query = query + "&street=" + streetid;
    if (citizenid != null && citizenid !== "") query = query + "&citizen=" + citizenid;
    if (landtypeid != null) query = query + "&landtype=" + landtypeid;
    if (fencetypeid != null) query = query + "&fencetype=" + fencetypeid;

    if (query != "") query = query.replace(/^./, "?");
    console.log(query)
    this.loadTable(query);

  }

  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (land: Land, filter: string) => {
      return (
        (csearchdata.cscitizen == null || (land.citizen && land.citizen.name.toLowerCase().includes(csearchdata.cscitizen.toLowerCase()))) &&
        (csearchdata.cssize == null || (land.size != null && land.size.toString().toLowerCase().includes(csearchdata.cssize.toLowerCase()))) &&
        (csearchdata.cslandtype == null || (land.landtype && land.landtype.name.toLowerCase().includes(csearchdata.cslandtype.toLowerCase()))) &&
        (csearchdata.csfencetype == null || (land.fencetype && land.fencetype.name.toLowerCase().includes(csearchdata.csfencetype.toLowerCase()))) &&
        (csearchdata.csstreet == null || (land.street && land.street.fullname.toLowerCase().includes(csearchdata.csstreet.toLowerCase())))
      );
    };

    // Trigger the filter
    this.data.filter = 'xx';
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: { heading: "Errors - Land Add", message: "You have the following Errors <br> " + errors }
      });

      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.land = this.form.getRawValue();


      // Convert map image & deed to base64 (pattern same as street)
      this.land.image = btoa(this.imagelandurl);
      this.land.deed = btoa(this.imagedeedurl);

      let landdata: string = "";

      landdata = landdata + "<br>Street : " + (this.land.street ? this.land.street.fullname : '');
      landdata = landdata + "<br>Citizen : " + (this.land.citizen ? this.land.citizen.name : '');
      landdata = landdata + "<br>Size : " + this.land.size + " sq.m";

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Land Add",
          message: "Are you sure you want to add the following Land? <br><br>" + landdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.ls.add(this.land).then((response: [] | undefined) => {

            if (response != undefined) {
              // @ts-ignore
              addstatus = response['errors'] == "";
              if (!addstatus) { // @ts-ignore
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
              this.clearDeed();
              Object.values(this.form.controls).forEach(control => control.markAsTouched());
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: { heading: "Status - Land Add", message: addmessage }
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
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
        data: { heading: "Errors - Land Update", message: "You have following Errors <br> " + errors }
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
            heading: "Confirmation - Land Update",
            message: "Are you sure to save the following updates? <br> <br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.land = this.form.getRawValue();

            if (this.form.controls['image'] && this.form.controls['image'].dirty)
              this.land.image = btoa(this.imagelandurl);
            else
              this.land.image = this.oldland.image;

            if (this.form.controls['deed'] && this.form.controls['deed'].dirty)
              this.land.deed = btoa(this.imagedeedurl);
            else
              this.land.deed = this.oldland.deed;

            this.land.id = this.oldland.id;

            this.ls.update(this.land).then((response: [] | undefined) => {

              if (response != undefined) { // @ts-ignore
                updstatus = response['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = response['errors'];
                }
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
                this.clearDeed();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: { heading: "Status - Land Update", message: updmessage }
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });

      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: { heading: "Confirmation - Land Update", message: "Nothing Changed" }
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Land Delete",
        message: "Are you sure to delete the following Land? <br> <br>" + (this.land && this.land.street ? this.land.street.fullname : '')
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ls.delete(this.land.id).then((response: [] | undefined) => {

          if (response != undefined) { // @ts-ignore
            delstatus = response['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = response['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found";
          }

        }).finally(() => {

          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.createForm();
            this.clearImage();
            this.clearDeed();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: { heading: "Status - Land Delete", message: delmessage }
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
        heading: "Confirmation - Land Clear",
        message: "Are you sure to clear the following details? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.createForm();
        this.selectedrow = null;
        this.clearImage();
        this.clearDeed();
      }
    });
  }

  clearImage(): void {
    this.imagelandurl = 'assets/default.png';
    if (this.form.controls['image']) this.form.controls['image'].setErrors({ 'required': true });
  }

  clearDeed(): void {
    this.imagedeedurl = 'assets/default.png';
    if (this.form.controls['deed']) this.form.controls['deed'].setErrors({ 'required': true });
  }

  // INNER FORM CHANGES (FILTER INNER FORM)
  selectProvineChnage(event: MatSelectChange) {
    const selctdvalue = event.value as Province;
    console.log(selctdvalue);
    this.districts = this.extdistricts;
    this.districts = this.districts.filter((s: District) => {
      return s.province.id === selctdvalue.id;
    })
  }
  selectDistrictChnage(event: MatSelectChange) {
    const selctdvalue2 = event.value as District;
    console.log(selctdvalue2);
    this.divisions = this.extdivisions;
    this.divisions = this.divisions.filter((dv: Division) => {
      return dv.district.id === selctdvalue2.id;
    })
  }
  selectDivisionChnage(event: MatSelectChange) {
    const selctdvalue = event.value as Division;
    console.log(selctdvalue);
    this.gnds = this.extgnds;
    this.gnds = this.gnds.filter((gn: Gnd) => {
      return gn.division.id === selctdvalue.id;
    });
  }
  selectGndChnage(event: MatSelectChange) {
    const selctdvalue = event.value as Gnd;
    console.log(selctdvalue);
    // filter streets by selected gnd
    this.streets = this.extstreets;

    this.streets = this.streets.filter((s: Street) =>
      s.gnd && s.gnd.id === selctdvalue.id
    );



    console.log(this.streets)


    // clear street control
    // this.innerform.controls['street'].setValue(null);
  }

  // ngAfterViewInit() {
  //   this.filteredStreet = this.streetControl.valueChanges.pipe(
  //     startWith(''),
  //     map(value => this._filterStreets(value || ''))
  //   );
  //
  //
  // }
  // showAllStreets() {
  //   if (!this.streetControl.value) {
  //     this.streetControl.setValue('');
  //   }
  // }
  //
  // private _filterStreets(value: string): Street[] {
  //   const filterValue = value.toLowerCase();
  //   // const gnd = this.form.controls['gnd'].getRawValue() as Gnd;
  //
  //   console.log(this.streets)
  //   return this.streets.filter(s => s.fullname.toLowerCase().includes(filterValue));
  // }

  rightSelected(): void {

    this.land.landfeaturedetails = this.availablelist.selectedOptions.selected.map(option => {
      const landfeaturedetails = new Landfeaturedetails(option.value);
      this.landfeatures = this.landfeatures.filter(landfeature => landfeature !== option.value); //Remove Selected
      this.landfeaturedetailsList.push(landfeaturedetails); // Add selected to Right Side
      return landfeaturedetails;
    });

    this.form.controls["landfeaturedetails"].clearValidators();
    this.form.controls["landfeaturedetails"].updateValueAndValidity(); // Update status
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected;
    selectedOptions.forEach(option => {
      const extlandfeaturedetails = option.value;
      this.landfeaturedetailsList = this.landfeaturedetailsList.filter(landfeature => landfeature !== extlandfeaturedetails);
      if (!this.landfeatures.includes(extlandfeaturedetails.landfeature)) {
        this.landfeatures.push(extlandfeaturedetails.landfeature);
      }
    });

    this.form.controls["landfeaturedetails"].setValidators(Validators.required);
  }

  rightAll(): void {
    this.land.landfeaturedetails = this.availablelist.selectAll().map(option => {
      const landfeaturedetails1 = new Landfeaturedetails(option.value);
      this.landfeatures = this.landfeatures.filter(landfeature => landfeature !== option.value);
      this.landfeaturedetailsList.push(landfeaturedetails1);
      return landfeaturedetails1;
    });

    this.form.controls["landfeaturedetails"].clearValidators();
    this.form.controls["landfeaturedetails"].updateValueAndValidity();
  }


  leftAll():void{
    for(let landfeaturedetails of this.landfeaturedetailsList) this.landfeatures.push(landfeaturedetails.landfeature);
    this.landfeaturedetailsList = [];
    this.form.controls["landfeaturedetails"].setValidators(Validators.required);

  }



  selectStreetChnage(event:MatSelectChange){
    const selctdvalue = event.value as Street;
    console.log(selctdvalue);
    this.form.controls["street"].setValue(selctdvalue);

  }

  // file input handlers (type-safe, pattern like street map image handling)
  selectMapImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is base64 data URL; store raw data for preview
      // we keep the same pattern as street: use the raw string for preview, and btoa when sending
      // strip data:image/...;base64, prefix if present
      const result = reader.result as string;
      this.imagelandurl = result.indexOf('base64,') >= 0 ? atob(result.split('base64,')[1]) : result;
      // mark control dirty
      this.form.controls['image'].markAsDirty();
    };
    reader.readAsDataURL(file);
  }

  selectDeedImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.imagedeedurl = result.indexOf('base64,') >= 0 ? atob(result.split('base64,')[1]) : result;
      this.form.controls['deed'].markAsDirty();
    };
    reader.readAsDataURL(file);
  }

  onStreetChnage(event: MatAutocompleteSelectedEvent) {
    const selectedValue = event.option.value ;
    console.log(selectedValue)
    const street = this.extstreets.find(s => s.fullname === selectedValue) as Street;
    this.form.controls['street'].setValue(street);
    console.log(street)
  }

}
