import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Street } from 'src/app/entity/Street';
import { Streetmatierial } from 'src/app/entity/Streetmatierial';
import { Streetstatus } from 'src/app/entity/Streetstatus';
import { Streettype } from 'src/app/entity/Streettype';
import { StreetService } from 'src/app/service/StreetService';
import { StreetmatierialService } from 'src/app/service/StreetmatierialService';
import { StreetstatusService } from 'src/app/service/StreetstatusService';
import { StreettypeService } from 'src/app/service/StreettypeService';
import { AuthorizationManager } from 'src/app/service/authorizationmanager';
import { RegexService } from 'src/app/service/regexservice';
import { ConfirmComponent } from 'src/app/util/dialog/confirm/confirm.component';
import { MessageComponent } from 'src/app/util/dialog/message/message.component';
import { UiAssist } from 'src/app/util/ui/ui.assist';

@Component({
  selector: 'app-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.css']
})
export class StreetComponent implements OnInit{

  columns: string[] = ['codename', 'fullname', 'length', 'width', 'streetstatus', 'streettype', 'streetmatierial' ];
  headers: string[] = ['Codename', 'Fullname', 'Length', 'Width', 'Street Status', 'Street Type', 'Street Matierial'];
  binders: string[] = ['codename', 'fullname', 'length', 'width', 'streetstatus.status', 'streettype.name', 'streetmatierial.name'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  street!:Street;
  oldstreet!:Street;
  selectedrow: any;

  streets: Array<Street> = [];
  streetstatuses: Array<Streetstatus> = [];
  streettypes: Array<Streettype> = [];
  streetmatierials: Array<Streetmatierial> = [];

  data!: MatTableDataSource<Street>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imagestreeturl: string = 'assets/default2.png';

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  regexes: any;

  uiassist: UiAssist;

  minDate : Date;
  maxDate : Date;

  constructor(

    private sts: StreetService,
    private sss:StreetstatusService,
    private stts:StreettypeService,
    private sms:StreetmatierialService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager)
  {
    this.ssearch = this.fb.group({
      "sscodename": new FormControl(),
      "ssfullname": new FormControl(),
      "ssstreetstatus": new FormControl(),
      "ssstreettype": new FormControl(),
      "ssstreetmatierial": new FormControl()
    });


    this.form = this.fb.group({
      codename: new FormControl('', []),
      fullname: new FormControl('', []),
      length: new FormControl('', []),
      width: new FormControl('', []),
      streetstatus: new FormControl('', []),
      streettype: new FormControl('', []),
      streetmatierial: new FormControl('', []),
      startlatitude: new FormControl('', []),
      startlongitude: new FormControl('', []),
      endlatitude: new FormControl('', []),
      endlongitude: new FormControl('', []),
      mapimage: new FormControl('', []),

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
    //
    this.sss.getAllListNameId().then((gens: Streetstatus[]) => {
      this.streetstatuses = gens;
    });
    //
    this.stts.getAllListNameId().then((dess: Streettype[]) => {
      this.streettypes = dess;
    });
    //
    this.sms.getAllListNameId().then((stes: Streetmatierial[]) => {
      this.streetmatierials = stes;
    });
    //
    // this.et.getAllList().then((typs: Emptype[]) => {
    //   this.employeetypes = typs;
    // });
    //
    // this.rs.get('employee').then((regs: []) => {
    //   this.regexes = regs;
    //   // this.createForm();
    // });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

  }


  createForm(): void {


    // Track value changes to set dirty/pristine status
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        if (['startlatitude','startlongitude','endlatitude','endlongitude'].includes(controlName)) {
          value = parseFloat(value);
        }

        if (this.oldstreet && control.valid) {
          // @ts-ignore
          if (value === this.oldstreet[controlName]) {
            control.markAsPristine();
          } else {
            control.markAsDirty();
          }
        } else {
          control.markAsPristine();
        }
      });
    }

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
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'street' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'street' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'street' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.sts.getAll(query)
      .then((strs: Street[]) => {
        this.streets = strs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.streets);
        this.data.paginator = this.paginator;
      });

  }

  fillForm(street: Street) {

    // Enable Update/Delete buttons, disable Add
    this.enableButtons(false, true, true);

    this.selectedrow = street;

    // Deep copy of street for comparison
    this.street = JSON.parse(JSON.stringify(street));
    this.oldstreet = JSON.parse(JSON.stringify(street));

    // Handle map image
    // if (this.street.mapimage != null) {
    //   this.imageempurl = atob(this.street.mapimage); // convert base64 to display
    //   this.form.controls['mapimage'].clearValidators();
    // } else {
    //   this.clearMapImage(); // function to reset image
    // }
    // this.street.mapimage = "";

    // Link select dropdowns
    // @ts-ignore
    this.street.streetstatus = this.streetstatuses.find(s => s.id === this.street.streetstatus.id);
    // @ts-ignore
    this.street.streettype = this.streettypes.find(s => s.id === this.street.streettype.id);
    // @ts-ignore
    this.street.streetmatierial = this.streetmatierials.find(s => s.id === this.street.streetmatierial.id);

    // Patch values to form
    this.form.patchValue(this.street);
    this.form.markAsPristine();
  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
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

    let codename = ssearchdata.sscodename;
    let fullname = ssearchdata.ssfullname;
    let streetstatusid = ssearchdata.ssstreetstatus;
    let streettypeid = ssearchdata.ssstreettype;
    let streetmatierialid = ssearchdata.ssstreetmatierial;

    let query = "";

    if (codename != null && codename.trim() != "") query = query + "&codename=" + codename;
    if (fullname != null && fullname.trim() != "") query = query + "&fullname=" + fullname;
    if (streetstatusid != null) query = query + "&streetstatus=" + streetstatusid;
    if (streettypeid != null) query = query + "&streettype=" + streettypeid;
    if (streetmatierialid != null) query = query + "&streetmatierial=" + streetmatierialid;

    if (query != "") query = query.replace(/^./, "?");
    console.log(query)
    this.loadTable(query);

  }

  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (street: Street, filter: string) => {
      return (
        (csearchdata.cscodename == null || street.codename.toLowerCase().includes(csearchdata.cscodename.toLowerCase())) &&
        (csearchdata.csfullname == null || street.fullname.toLowerCase().includes(csearchdata.csfullname.toLowerCase())) &&
        (csearchdata.csstreetstatus == null || street.streetstatus.status.toLowerCase().includes(csearchdata.csstreetstatus.toLowerCase())) &&
        (csearchdata.csstreettype == null || street.streettype.name.toLowerCase().includes(csearchdata.csstreettype.toLowerCase())) &&
        (csearchdata.csstreetmatierial == null || street.streetmatierial.name.toLowerCase().includes(csearchdata.csstreetmatierial.toLowerCase()))
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
        data: { heading: "Errors - Street Add", message: "You have the following Errors <br> " + errors }
      });

      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.street = this.form.getRawValue();

      // Convert map image to base64
      this.street.mapimage = btoa(this.imagestreeturl);

      let streetdata: string = "";

      streetdata = streetdata + "<br>Codename : " + this.street.codename;
      streetdata = streetdata + "<br>Fullname : " + this.street.fullname;
      streetdata = streetdata + "<br>Length : " + this.street.length + " m";
      streetdata = streetdata + "<br>Width : " + this.street.width + " m";

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Street Add",
          message: "Are you sure you want to add the following Street? <br><br>" + streetdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.sts.add(this.street).then((response: [] | undefined) => {

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
              Object.values(this.form.controls).forEach(control => control.markAsTouched());
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: { heading: "Status - Street Add", message: addmessage }
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
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
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
        data: { heading: "Errors - Street Update", message: "You have following Errors <br> " + errors }
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
            heading: "Confirmation - Street Update",
            message: "Are you sure to save the following updates? <br> <br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.street = this.form.getRawValue();

            if (this.form.controls['mapimage'] && this.form.controls['mapimage'].dirty)
              this.street.mapimage = btoa(this.imagestreeturl);
            else
              this.street.mapimage = this.oldstreet.mapimage;

            this.street.id = this.oldstreet.id;

            this.sts.update(this.street).then((response: [] | undefined) => {

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
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: { heading: "Status - Street Update", message: updmessage }
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });

      } else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: { heading: "Confirmation - Street Update", message: "Nothing Changed" }
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }

  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Street Delete",
        message: "Are you sure to delete the following Street? <br> <br>" + this.street.fullname
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.sts.delete(this.street.id).then((response: [] | undefined) => {

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
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: { heading: "Status - Street Delete", message: delmessage }
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
        heading: "Confirmation - Street Clear",
        message: "Are you sure to clear the following details? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.createForm();
        this.selectedrow = null;
        this.clearImage();
      }
    });
  }

  clearImage(): void {
    this.imagestreeturl = 'assets/default.png';
    this.form.controls['mapimage'].setErrors({'required': true});
  }
}
