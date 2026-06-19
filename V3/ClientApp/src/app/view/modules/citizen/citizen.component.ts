import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Citizen } from 'src/app/entity/Citizen';
import { Religion } from 'src/app/entity/religion';
import { Matiralstatus } from 'src/app/entity/matiralstatus';
import { Educationlevel } from 'src/app/entity/educationlevel';
import { Ethnicity } from 'src/app/entity/ethnicity';
import { Gender } from 'src/app/entity/gender';
import { Aidprogram } from 'src/app/entity/aidprogram';
import { Relationshiptype } from 'src/app/entity/relationshiptype';

import { CitizenService } from 'src/app/service/CitizenService';
import { ReligionService } from 'src/app/service/religionservice';
import { MatiralstatusService } from 'src/app/service/matiralstatusservice';
import { EducationlevelService } from 'src/app/service/educationlevelservice';
import { EthnicityService } from 'src/app/service/ethnicityservice';
import { GenderService } from 'src/app/service/genderservice';
import { AidprogramService } from 'src/app/service/aidprogramservice';
import { RelationshiptypeService } from 'src/app/service/relationshiptypeservice';

import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatSelectionList} from "@angular/material/list";
import {Landfeature} from "../../../entity/Landfeature";
import {Landfeaturedetails} from "../../../entity/Landfeaturedetails";
import {Citizenaidprogram} from "../../../entity/Citizenaidprogram";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Citizenguardian} from "../../../entity/Citizenguardian";

@Component({
  selector: 'app-citizen',
  templateUrl: './citizen.component.html',
  styleUrls: ['./citizen.component.css']
})
export class CitizenComponent implements OnInit {

  // TABLE
  columns: string[] = ['name', 'nic', 'gender', 'religion', 'ethnicity'];
  headers: string[] = ['Name', 'NIC', 'Gender', 'Religion', 'Ethnicity'];
  binders: string[] = ['name', 'nic', 'gender.name', 'religion.name', 'ethnicity.name'];

  data!: MatTableDataSource<Citizen>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  imagelandurl: string = 'assets/default2.png';
  imagedeedurl: string = 'assets/default2.png';

  // FORMS
  public form!: FormGroup;
  public csearch!: FormGroup;
  public ssearch!: FormGroup;

  // DATA
  citizens: Citizen[] = [];

  religions: Religion[] = [];
  matiralstatuses: Matiralstatus[] = [];
  educationlevels: Educationlevel[] = [];
  ethnicities: Ethnicity[] = [];
  genders: Gender[] = [];
  // aidprograms: Aidprogram[] = [];

  citizen!: Citizen;
  oldcitizen!: Citizen;

  selectedrow: any;

  regexes: any;
  uiassist: UiAssist;


  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;


  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;


  @Input()aidprograms: Array<Aidprogram> = [];
  oldaidprograms:Array<Aidprogram>=[];
  @Input()selectedaidprograms: Array<Aidprogram> =[];
  citizenaidprograms: Array<Citizenaidprogram> = [];

  incolumns: string[] = ['relationshiptype', 'citizenparent','remove','edit'];
  inheaders: string[] = ['Relationshiptype', 'Citizenguardian','Remove','Edit'];
  inbinders: string[] = ['relationshiptype.name', 'citizenparent.name','deleteRaw()','fillinnerform()'];

  innerdata: any;
  oldinnerdata: any;

  indata!: MatTableDataSource<Citizenguardian>;
  innerform!: FormGroup;
  citizenguardians: Array<Citizenguardian> = [];
  citizenguardiansChanges: Array<Citizenguardian> = [];
  citizenguardian!:Citizenguardian;
 oldcitizenguardian!:Citizenguardian;

  relationshiptypes: Array<Relationshiptype> = [];
  id:number = 0;
  disablededit: boolean = true;
  disabledadd: boolean = false;
  innerformUpdated: boolean =  false;


  constructor(

    private fb: FormBuilder,
    private dg: MatDialog,

    private cs: CitizenService,
    private rs: ReligionService,
    private ms: MatiralstatusService,
    private es: EducationlevelService,
    private ets: EthnicityService,
    private gs: GenderService,
    private aps: AidprogramService,
    private rts: RelationshiptypeService,
    public authService: AuthorizationManager,


  ) {

    this.form = this.fb.group({
      name: new FormControl(),
      namewithinitials: new FormControl(),
      nic: new FormControl(),
      birthcetificateno: new FormControl(),
      dateofbirth: new FormControl(),
      mobileno: new FormControl(),
      email: new FormControl(),
      isconvicted: new FormControl(),
      medicalconditions: new FormControl(),
      remarks: new FormControl(),

      religion: new FormControl(),
      matiralstatus: new FormControl(),
      educationlevel: new FormControl(),
      ethnicity: new FormControl(),
      gender: new FormControl(),

      citizenaidprograms: new FormControl(),
      citizenguardians: new FormControl()
    });

    this.csearch = this.fb.group({
      cscitizen: new FormControl(),      // name
      csnic: new FormControl(),          // NIC
      csreligion: new FormControl(),     // Religion
      csethnicity: new FormControl(),    // Ethnicity
      cseducationlevel: new FormControl() // Education Level
    });

    this.ssearch = this.fb.group({
      ssname: new FormControl(),          // Name
      ssnic: new FormControl(),           // NIC
      ssreligion: new FormControl(),      // Religion ID
      ssethnicity: new FormControl(),     // Ethnicity ID
      sseducationlevel: new FormControl() // Education Level ID
    });
    // @ts-ignore
    this.citizenguardian =  new Citizenguardian(
      0,
      // @ts-ignore
      new Relationshiptype(),
      // @ts-ignore
      new Citizen()
    )
    this.innerform = this.fb.group({
      relationshiptype: new FormControl(this.citizenguardian.relationshiptype, [Validators.required]),
      citizenparent:    new FormControl(this.citizenguardian.citizenparent, [Validators.required]),

    }, { updateOn: 'change' });

    this.citizen = new Citizen(0, '', '');
    this.uiassist = new UiAssist(this);
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.loadTable("");

    this.rs.getAllListNameId().then(r => this.religions = r);
    this.ms.getAllListNameId().then(r => this.matiralstatuses = r);
    this.es.getAllListNameId().then(r => this.educationlevels = r);
    this.ets.getAllListNameId().then(r => this.ethnicities = r);
    this.gs.getAllListNameId().then(r => this.genders = r);
    this.aps.getAllListNameId().then(r => this.aidprograms = r);
    this.rts.getAllListNameId().then(r => this.relationshiptypes = r);

    this.aps.getAllListNameId().then((r:Aidprogram[]) => {
      this.aidprograms = r
      this.oldaidprograms = this.aidprograms
    });


    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.createForm();

  }

  createForm(): void {

    // Reset form state
    // this.form.reset();
    this.citizenguardians = [];
    this.indata = new MatTableDataSource<Citizenguardian>(this.citizenguardians);
    this.leftAll();
    this.innerformUpdated = false;

    // Track value changes like BuildingComponent
    for (const controlName in this.form.controls) {

      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {

        // Handle numeric / boolean conversions if needed
        if (['isconvicted'].includes(controlName)) {
          value = value ? 1 : 0;
        }

        // Compare with old citizen for dirty/pristine
        if (this.oldcitizen && control.valid) {

          // @ts-ignore
          if (value === this.oldcitizen[controlName]) {
            control.markAsPristine();
          } else {
            control.markAsDirty();
          }

        } else {
          control.markAsPristine();
        }

      });

    }
    this.enableButtons(true, false, false);
    console.log(this.enaadd)

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

    this.hasInsertAuthority = authorities.some(
      authority => authority.module === 'citizen' && authority.operation === 'insert'
    );

    this.hasUpdateAuthority = authorities.some(
      authority => authority.module === 'citizen' && authority.operation === 'update'
    );

    this.hasDeleteAuthority = authorities.some(
      authority => authority.module === 'citizen' && authority.operation === 'delete'
    );

  }

  // LOAD TABLE
  loadTable(query: string) {

    this.cs.getAll(query)
      .then((cts: Citizen[]) => {
        this.citizens = cts;
        console.log(this.citizens);
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.citizens);
        this.data.paginator = this.paginator;
      });

  }

  // FILL FORM
  fillForm(citizen: Citizen) {

    // Enable Update/Delete buttons, disable Add
    this.enableButtons(false, true, true);

    this.selectedrow = citizen;

    // Deep copy for comparison
    this.citizen = JSON.parse(JSON.stringify(citizen));
    this.oldcitizen = JSON.parse(JSON.stringify(citizen));

    console.log(this.citizen);

    // ===== LINK DROPDOWNS (IMPORTANT) =====

    // @ts-ignore
    this.citizen.religion = this.religions.find(r => r.id === this.citizen.religion?.id);

    // @ts-ignore
    this.citizen.matiralstatus = this.matiralstatuses.find(m => m.id === this.citizen.matiralstatus?.id);

    // @ts-ignore
    this.citizen.educationlevel = this.educationlevels.find(e => e.id === this.citizen.educationlevel?.id);

    // @ts-ignore
    this.citizen.ethnicity = this.ethnicities.find(e => e.id === this.citizen.ethnicity?.id);

    // @ts-ignore
    this.citizen.gender = this.genders.find(g => g.id === this.citizen.gender?.id);

    // ===== OPTIONAL RELATION LISTS =====

    // Aid Programs (if used as multi-select)
    // if (this.citizen.citizenaidprograms) {
    //   this.citizen.citizenaidprograms = this.citizen.citizenaidprograms.map((ap: any) =>
    //     this.aidprograms.find(a => a.id === ap.aidprogram?.id)
    //   );
    // }
    this.aidprograms = this.oldaidprograms;
    this.citizenaidprograms = this.citizen?.citizenaidprograms;
    this.citizen.citizenaidprograms.forEach((citizenaidprogram:Citizenaidprogram)=> this.aidprograms = this.aidprograms.filter((lf)=> lf.id != citizenaidprogram.aidprogram.id));
    // this.user.userroles.forEach((ur)=> this.roles = this.roles.filter((r)=> r.id != ur.role.id )); // Load or remove roles by comparing with user.userroles


    // Guardians / Relationship Types (if used)
    // if (this.citizen.citizenguardians) {
    //   this.citizen.citizenguardians = this.citizen.citizenguardians.map((cg: any) => ({
    //     ...cg,
    //     relationshiptype: this.relationshiptypes.find(rt => rt.id === cg.relationshiptype?.id)
    //   }));
    // }

    this.citizenguardians = this.citizen.citizenguardians;
    this.indata = new MatTableDataSource<Citizenguardian>(this.citizenguardians);
    // ===== PATCH FORM =====
    this.form.patchValue(this.citizen);
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

    let nic = ssearchdata.ssnic;
    let name = ssearchdata.ssname;
    let religion = ssearchdata.ssreligion;
    let ethnicity = ssearchdata.ssethnicity;
    let educationlevel = ssearchdata.sseducationlevel;


    let query = "";

    if (nic != null && nic !== "") query = query + "&nic=" + nic;
    if (name != null && name !== "") query = query + "&name=" + name;
    if (religion != null && religion !== "") query = query + "&religion=" + religion;
    if (ethnicity != null && ethnicity !== "") query = query + "&ethnicity=" + ethnicity;
    if (educationlevel != null && educationlevel !== "") query = query + "&educationlevel=" + educationlevel;


    if (query != "") query = query.replace(/^./, "?");

    console.log(query);
    this.loadTable(query);
  }

  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (citizen: Citizen, filter: string) => {
      return (
        (csearchdata.name == null || (citizen.name && citizen.name.toLowerCase().includes(csearchdata.name.toLowerCase()))) &&
        (csearchdata.nic == null || (citizen.nic && citizen.nic.toLowerCase().includes(csearchdata.nic.toLowerCase()))) &&
        (csearchdata.religion == null || (citizen.religion && citizen.religion.name.toLowerCase().includes(csearchdata.religion.toLowerCase()))) &&
        (csearchdata.ethnicity == null || (citizen.ethnicity && citizen.ethnicity.name.toLowerCase().includes(csearchdata.ethnicity.toLowerCase())))
      );
    };

    // Trigger filtering
    this.data.filter = 'xx';
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {
          heading: "Errors - Citizen Add",
          message: "You have the following Errors <br> " + errors
        }
      });

      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      this.citizen = this.form.getRawValue();

      // -----------------------------
      // OPTIONAL FIELD HANDLING
      // -----------------------------

      // handle boolean (isconvicted)
      if (this.citizen.isconvicted == null) {
        this.citizen.isconvicted = 0;
      }

      // handle relationships (many-to-many / one-to-many)
      this.citizenguardians.forEach(s => {
        // @ts-ignore
        delete s.id;   // removes the id property
      });
      this.citizen.citizenguardians = this.citizenguardians;

      // -----------------------------
      // BUILD CONFIRMATION DATA
      // -----------------------------

      let citizendata: string = "";

      citizendata += "<br>Name : " + this.citizen.name;
      citizendata += "<br>NIC : " + this.citizen.nic;
      citizendata += "<br>Religion : " + (this.citizen.religion ? this.citizen.religion.name : '');
      citizendata += "<br>Ethnicity : " + (this.citizen.ethnicity ? this.citizen.ethnicity.name : '');
      citizendata += "<br>Education Level : " + (this.citizen.educationlevel ? this.citizen.educationlevel.name : '');
      citizendata += "<br>Email : " + this.citizen.email;
      citizendata += "<br>Mobile No : " + this.citizen.mobileno;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Citizen Add",
          message: "Are you sure you want to add the following Citizen? <br><br>" + citizendata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {

        if (result) {

          this.cs.add(this.citizen).then((response: any) => {

            if (response != undefined) {

              // backend returns { errors: "" }
              addstatus = response['errors'] == "";

              if (!addstatus) {
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

              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });

              this.loadTable("");

            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {
                heading: "Status - Citizen Add",
                message: addmessage
              }
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

  // add(){
  //   this.citizen = this.form.getRawValue();
  //   this.citizen.citizenguardians = this.citizenguardians;
  //   console.log(this.citizen)
  // }
  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {

      const control = this.form.controls[controlName];

      if (control.errors) {

        // If you have regex validation messages defined
        if (this.regexes && this.regexes[controlName] != undefined) {

          errors = errors + "<br>" + this.regexes[controlName]['message'];

        } else {

          // Better readable fallback messages (IMPORTANT for Citizen module)
          switch (controlName) {

            case 'name':
              errors += "<br>Name is required";
              break;

            case 'nic':
              errors += "<br>NIC is required";
              break;

            case 'email':
              errors += "<br>Invalid Email";
              break;

            case 'mobileno':
              errors += "<br>Invalid Mobile Number";
              break;

            case 'religion':
              errors += "<br>Religion is required";
              break;

            case 'ethnicity':
              errors += "<br>Ethnicity is required";
              break;

            case 'educationlevel':
              errors += "<br>Education Level is required";
              break;

            default:
              errors += "<br>Invalid " + controlName;
          }
        }
      }
    }

    return errors;
  }

  getUpdates(): string {

    let updates: string = "";
    if (this.innerformUpdated){
      updates = updates + "<br>" +  "Guardian details Changed"
    }

    for (const controlName in this.form.controls) {

      const control = this.form.controls[controlName];

      if (control.dirty) {

        // Convert field name to readable label
        let label = controlName.charAt(0).toUpperCase() + controlName.slice(1);

        // Optional: make it more user-friendly
        switch (controlName) {

          case 'name':
            label = 'Name';
            break;

          case 'namewithinitials':
            label = 'Name with Initials';
            break;

          case 'nic':
            label = 'NIC';
            break;

          case 'birthcetificateno':
            label = 'Birth Certificate No';
            break;

          case 'dateofbirth':
            label = 'Date of Birth';
            break;

          case 'mobileno':
            label = 'Mobile Number';
            break;

          case 'email':
            label = 'Email';
            break;

          case 'isconvicted':
            label = 'Conviction Status';
            break;

          case 'medicalconditions':
            label = 'Medical Conditions';
            break;

          case 'remarks':
            label = 'Remarks';
            break;

          case 'religion':
            label = 'Religion';
            break;

          case 'matiralstatus':
            label = 'Marital Status';
            break;

          case 'educationlevel':
            label = 'Education Level';
            break;

          case 'ethnicity':
            label = 'Ethnicity';
            break;

          case 'gender':
            label = 'Gender';
            break;

          case 'citizenaidprograms':
            label = 'Aid Programs';
            break;

          case 'citizenguardians':
            label = 'Guardians';
            break;
        }

        updates = updates + "<br>" + label + " Changed";
      }

    }

    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {
          heading: "Errors - Citizen Update",
          message: "You have following Errors <br> " + errors
        }
      });

      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Citizen Update",
            message: "Are you sure to save the following updates? <br><br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {

          if (result) {

            this.citizen = this.form.getRawValue();

            // -----------------------------
            // Preserve OLD DATA (important for relationships)
            // -----------------------------
            this.citizen.id = this.oldcitizen.id;

            // preserve relationships if not changed
            if (!this.citizen.citizenaidprograms) {
              this.citizen.citizenaidprograms = this.oldcitizen.citizenaidprograms;
            }
            this.citizenguardians.forEach(s => {
              // @ts-ignore
              delete s.id;   // removes the id property
            });
            this.citizen.citizenguardians =  this.citizenguardians;


            // -----------------------------
            // HANDLE BOOLEAN FIELD
            // -----------------------------
            if (this.citizen.isconvicted == null) {
              this.citizen.isconvicted = 0;
            }

            // -----------------------------
            // CALL SERVICE
            // -----------------------------
            this.cs.update(this.citizen).then((response: any) => {

              if (response != undefined) {

                updstatus = response['errors'] == "";

                if (!updstatus) {
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

                this.selectedrow = null;

                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });

                this.loadTable("");
                this.innerformUpdated =  false;
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {
                  heading: "Status - Citizen Update",
                  message: updmessage
                }
              });

              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  return;
                }
              });

            });
          }
        });

      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {
            heading: "Citizen Update",
            message: "Nothing Changed"
          }
        });

        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });
      }
    }
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Citizen Delete",
        message: "Are you sure to delete the following Citizen? <br> <br>" + this.citizen.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {

        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.cs.delete(this.citizen.id).then((response: any) => {

          if (response != undefined) {
            // @ts-ignore
            delstatus = response['errors'] == "";

            if (!delstatus) {
              // @ts-ignore
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
            this.selectedrow = null;

            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });

            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {
              heading: "Status - Citizen Delete",
              message: delmessage
            }
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

  clear(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Citizen Clear",
        message: "Are you sure to clear the following details? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {

      if (result) {

        this.form.reset();
        this.createForm();

        this.selectedrow = null;

        // reset citizen object (important to avoid stale update/delete issues)
        this.citizen = {
          id: 0,
          name: "",
          namewithinitials: "",
          nic: "",
          birthcetificateno: "",
          dateofbirth: null,
          mobileno: "",
          email: "",
          isconvicted: false,
          medicalconditions: "",
          remarks: "",

          religion: null,
          matiralstatus: null,
          educationlevel: null,
          ethnicity: null,
          gender: null,

          citizenaidprograms: null,
          citizenguardians: null
        } as any;

        Object.values(this.form.controls).forEach(control => {
          control.markAsPristine();
          control.markAsUntouched();
        });

      }

    });
  }

  // ADD
  // add() {
  //
  //   const citizen = this.form.getRawValue();
  //
  //   this.cs.add(citizen).then(res => {
  //
  //     const msg = this.dg.open(MessageComponent, {
  //       width: '400px',
  //       data: { heading: 'Citizen Add', message: 'Saved Successfully' }
  //     });
  //
  //     msg.afterClosed().subscribe(() => {
  //       this.form.reset();
  //       this.loadTable("");
  //     });
  //
  //   });
  //
  // }
  //
  // // UPDATE
  // update() {
  //
  //   const citizen = this.form.getRawValue();
  //   citizen.id = this.oldcitizen.id;
  //
  //   this.cs.update(citizen).then(res => {
  //
  //     const msg = this.dg.open(MessageComponent, {
  //       width: '400px',
  //       data: { heading: 'Citizen Update', message: 'Updated Successfully' }
  //     });
  //
  //     msg.afterClosed().subscribe(() => {
  //       this.loadTable("");
  //     });
  //
  //   });
  //
  // }
  //
  // // DELETE
  // delete() {
  //
  //   const confirm = this.dg.open(ConfirmComponent, {
  //     width: '400px',
  //     data: { heading: 'Delete Citizen', message: 'Are you sure?' }
  //   });
  //
  //   confirm.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.cs.delete(this.citizen.id).then(() => {
  //         this.loadTable("");
  //       });
  //     }
  //   });
  //
  // }

  rightSelected(): void {

    this.citizen.citizenaidprograms = this.availablelist.selectedOptions.selected.map(option => {
      const citizenaidprogram = new Citizenaidprogram(option.value);
      this.aidprograms = this.aidprograms.filter(aidprogram => aidprogram !== option.value); //Remove Selected
      this.citizenaidprograms.push(citizenaidprogram); // Add selected to Right Side
      return citizenaidprogram;
    });

    this.form.controls["citizenaidprograms"].clearValidators();
    this.form.controls["citizenaidprograms"].updateValueAndValidity(); // Update status
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected;
    selectedOptions.forEach(option => {
      const extcitizenaidprogram = option.value as Citizenaidprogram;
      this.citizenaidprograms = this.citizenaidprograms.filter(citizenaidprogram => citizenaidprogram !== extcitizenaidprogram);
      if (!this.aidprograms.includes(extcitizenaidprogram.aidprogram)) {
        this.aidprograms.push(extcitizenaidprogram.aidprogram);
      }
    });

    this.form.controls["citizenaidprograms"].setValidators(Validators.required);
  }

  rightAll(): void {
    this.citizen.citizenaidprograms = this.availablelist.selectAll().map(option => {
      const citizenaidprogram = new Citizenaidprogram(option.value);
      this.aidprograms = this.aidprograms.filter(aidprogram => aidprogram !== option.value); //Remove Selected
      this.citizenaidprograms.push(citizenaidprogram); // Add selected to Right Side
      return citizenaidprogram;
    });

    this.form.controls["citizenaidprograms"].clearValidators();
    this.form.controls["citizenaidprograms"].updateValueAndValidity();
  }


  leftAll():void{
    for(let citizenaidprogram of this.citizenaidprograms) this.aidprograms.push(citizenaidprogram.aidprogram);
    this.citizenaidprograms = [];
    this.form.controls["citizenaidprograms"].setValidators(Validators.required);

  }


  btnaddMc() {

    // let id = 0;
    //Extract Form Data
    this.innerdata = this.innerform.getRawValue();

    if (this.innerdata != null) {


      //Create a New Puoitems Instance:
      let newCitizenguardian = new Citizenguardian(
        this.id,                        // id
        this.innerdata.relationshiptype,        // quantity
        this.innerdata.citizenparent,       // unitPrice
      );

      //Copy Existing Data to Temporary Array
      let temCD:Citizenguardian[] = [];

      if (this.indata != null) this.indata.data.forEach((i) => temCD.push(i));

      //Copy Data to poitems
      this.citizenguardians = [];

      temCD.forEach((t) => this.citizenguardians.push(t));


      //Add New poitem to poitems and Track Changes
      this.citizenguardians.push(newCitizenguardian);
      this.citizenguardiansChanges.push(newCitizenguardian);
      //Update the Table Data Source
      this.indata = new MatTableDataSource(this.citizenguardians);

      //Increment the ID
      this.id++;

      this.innerform.reset();
    }
  }

  deleteRaw(element: Citizenguardian) {

    //Retrieve Existing Data Source
    let datasources = this.indata.data

    //Find the Index of the Item to Delete
    const index = datasources.findIndex(m => m.id === element.id);
    //Remove the Item if it Exists
    if (index > -1) {
      datasources.splice(index, 1);
    }
    //Update the Data Source
    this.indata.data = datasources;
    //Track Changes
    this.citizenguardiansChanges.push(element);
    //Update the Displayed Items
    this.citizenguardians = this.indata.data;

  }

  fillinnerform(row:Citizenguardian){
    this.disablededit = false;
    this.disabledadd = true;
    console.log(row)
    this.citizenguardian = JSON.parse(JSON.stringify(row));

    //@ts-ignore
    this.citizenguardian.relationshiptype = this.relationshiptypes.find((p) => p.id ===  this.citizenguardian?.relationshiptype.id);
    //@ts-ignore
    this.citizenguardian.citizenparent = this.citizens.find((p) => p.id ===  this.citizenguardian?.citizenparent.id)
    this.innerform.patchValue(this.citizenguardian);
    this.innerform.markAsPristine();

  }

  updateRow() {

    const updatedLine = this.innerform.getRawValue() as Citizenguardian;
    let datasources = this.indata

    // Find index of the row to update
    const index = datasources.data.findIndex((q) => q.citizenparent.nic === updatedLine.citizenparent.nic);
    console.log(updatedLine);
    console.log(index )

    if (index !== -1) {
      // Replace the object at that index
      datasources.data[index] = updatedLine;

      // Trigger table refresh
      datasources._updateChangeSubscription();

    }
    this.innerform.reset();
    this.disabledadd = false;
    this.disablededit = true;
    this.innerformUpdated =  true;
  }


}

