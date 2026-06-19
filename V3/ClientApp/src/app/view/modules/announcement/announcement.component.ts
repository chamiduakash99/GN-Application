import {Component, ViewChild} from '@angular/core';
import {Announcement} from "../../../entity/announcement";
import {AnnouncementService} from "../../../service/announcementservice";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})

export class AnnouncementComponent {

  columns: string[] = ['title', 'content', 'isactive', 'publishedat', 'expiredat'];
  headers: string[] = ['Title', 'Content', 'Active', 'Published At', 'Expired At'];
  binders: string[] = ['title', 'content', 'getActive()', 'publishedat', 'expiredat'];

  cscolumns: string[] = ['cstitle', 'cscontent', 'csisactive', 'cspublishedat', 'csexpiredat'];
  csprompts: string[] = ['Search by Title', 'Search by Content', 'Search by Status', 'Search by Published', 'Search by Expired'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  announcement!: Announcement;
  oldannouncement!: Announcement;

  selectedrow: any;

  announcements: Array<Announcement> = [];
  data!: MatTableDataSource<Announcement>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  uiassist: UiAssist;

  constructor(

    private as: AnnouncementService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {


    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "cstitle": new FormControl(),
      "cscontent": new FormControl(),
      "csisactive": new FormControl(),
      "cspublishedat": new FormControl(),
      "csexpiredat": new FormControl(),
      "csmodi": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "sstitle": new FormControl(),
      "ssisactive": new FormControl()
    });


    this.form = this.fb.group({
      "title": new FormControl('', [Validators.required]),
      "content": new FormControl('', [Validators.required]),
      "isactive": new FormControl(1, [Validators.required]),
      "publishedat": new FormControl('', [Validators.required]),
      "expiredat": new FormControl(''),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();


    this.createForm();

    const authoritiesArray = this.authService.getAuthorities();

    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  createForm() {


    this.form.controls['isactive'].setValidators([Validators.required]);
    this.form.controls['publishedat'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "publishedat" || controlName == "expiredat")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd HH:mm:ss');

          if (this.oldannouncement != undefined && control.valid) {
            // @ts-ignore
            if (value === this.announcement[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.enableButtons(true,false,false);

  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'announcement' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'announcement' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'announcement' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.as.getAll(query)
      .then((anns: Announcement[]) => {
        this.announcements = anns;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.announcements);
        this.data.paginator = this.paginator;
      });

  }

  getModi(element: Announcement) {
    return element.title + '(' + (element.isactive == 1 ? 'Active' : 'Inactive') + ')';
  }

  getActive(element: Announcement) {
    return element.isactive == 1 ? 'Active' : 'Inactive';
  }


  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (announcement: Announcement, filter: string) => {
      return (cserchdata.cstitle == null || announcement.title.toLowerCase().includes(cserchdata.cstitle)) &&
        (cserchdata.cscontent == null || announcement.content.toLowerCase().includes(cserchdata.cscontent)) &&
        (cserchdata.csisactive == null || this.getActive(announcement).toLowerCase().includes(cserchdata.csisactive)) &&
        (cserchdata.cspublishedat == null || (announcement.publishedat + '').toLowerCase().includes(cserchdata.cspublishedat)) &&
        (cserchdata.csexpiredat == null || (announcement.expiredat + '').toLowerCase().includes(cserchdata.csexpiredat)) &&
        (cserchdata.csmodi == null || this.getModi(announcement).toLowerCase().includes(cserchdata.csmodi));
    };

    this.data.filter = 'xx';

  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let title = sserchdata.sstitle;
    let isactive = sserchdata.ssisactive;

    let query = "";

    if (title != null && title.trim() != "") query = query + "&title=" + title;
    if (isactive != null) query = query + "&isactive=" + isactive;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

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


  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Announcement Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.announcement = this.form.getRawValue();

      let anndata: string = "";

      anndata = anndata + "<br>Title is : " + this.announcement.title;
      anndata = anndata + "<br>Published At is : " + this.announcement.publishedat;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Announcement Add",
          message: "Are you sure to Add the following Announcement? <br> <br>" + anndata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.as.add(this.announcement).then((responce: [] | undefined) => {
            if (responce != undefined) { // @ts-ignore
              addstatus = responce['errors'] == "";
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.form.controls['isactive'].setValue(1);
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Announcement Add", message: addmessage}
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
        errors = errors + "<br>Invalid " + controlName;
      }
    }

    return errors;
  }

  fillForm(announcement: Announcement) {

    this.enableButtons(false,true,true);

    this.selectedrow=announcement;

    this.announcement = JSON.parse(JSON.stringify(announcement));
    this.oldannouncement = JSON.parse(JSON.stringify(announcement));

    this.form.patchValue(this.announcement);
    this.form.markAsPristine();

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Announcement Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Announcement Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.announcement = this.form.getRawValue();
            this.announcement.id = this.oldannouncement.id;
            this.announcement.employee = this.oldannouncement.employee;

            this.as.update(this.announcement).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.form.controls['isactive'].setValue(1);
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Announcement Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Announcement Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }



  delete() {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Announcement Delete",
        message: "Are you sure to Delete following Announcement? <br> <br>" + this.announcement.title
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.as.delete(this.announcement.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.form.controls['isactive'].setValue(1);
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Announcement Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

  clear():void{

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Announcement Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.selectedrow = null;
        this.createForm();
        this.form.controls['isactive'].setValue(1);
      }
    });
  }
}
