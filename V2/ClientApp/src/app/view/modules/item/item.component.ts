import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemService} from "../../../service/itemservice";
import {Item} from "../../../entity/item";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ItemStatus} from "../../../entity/itemstatus";
import {Brand} from "../../../entity/brand";
import {Subcategory} from "../../../entity/subcategory";
import {Unittype} from "../../../entity/unittype";
import {ItemstatusService} from "../../../service/itemstatusservice";
import {BrandService} from "../../../service/brandservice";
import {SubcategoryService} from "../../../service/subcategoryservice";
import {UnittypeService} from "../../../service/unittypeservice";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {CategoryService} from "../../../service/categoryservice";
import {Category} from "../../../entity/category";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{

  itemForm! : FormGroup;
  itemSearchForm! : FormGroup;

  items!: Array<Item>;

  olditem!: Item;
  item!: Item;

  uiassist ;
  data!: MatTableDataSource<Item>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageurl: string = '';
  imageempurl: string = 'assets/default.png';

  itemStatus! : Array<ItemStatus>;
  brands! : Array<Brand>;
  subcategories! : Array<Subcategory>;
  categories! : Array<Category>;
  unittypes! : Array<Unittype>;


    columns: string[] = ['code', 'name', 'sprice','brand', 'status' ];
    headers: string[] = ['Code', 'Name', 'Sale Price', 'Brand', 'Status'];
    binders: string[] = ['code', 'name', 'sprice', 'brand.name', 'itemstatus.name'];
    constructor(
      private itemService : ItemService,
      private itemStatusService: ItemstatusService,
      private brandService : BrandService,
      private categoryService : CategoryService,
      private subCategoryService : SubcategoryService,
      private unittypeService : UnittypeService,
      private formBuilder : FormBuilder,
      private datePipe : DatePipe,
      private dialogBox : MatDialog
    ) {

      this.uiassist = new UiAssist(this);

      this.itemForm = this.formBuilder.group({
        "code": new FormControl('', [Validators.required]),
        "name": new FormControl('', [Validators.required]),
        "pprice": new FormControl('', [Validators.required]),
        "sprice": new FormControl('', [Validators.required]),
        "photo": new FormControl('', [Validators.required]),
        "quantity": new FormControl('', [Validators.required]),
        "rop": new FormControl('', [Validators.required]),
        "dointroduced": new FormControl('', [Validators.required]),
        "itemstatus": new FormControl('', [Validators.required]),
        "brand": new FormControl('',[Validators.required] ),
        "unittype": new FormControl('', [Validators.required]),
        "category": new FormControl('', [Validators.required]),
        "subcategory": new FormControl('', [Validators.required]),
      }, {updateOn: 'change'});

      this.itemSearchForm = this.formBuilder.group({
        "name": new FormControl( ),
        "brand": new FormControl( ),
      }, {updateOn: 'change'});

    }

    ngOnInit() {
      this.initialize();
    }

    initialize(){

      this.itemStatusService.getAllList().then((itemstatuses => {
        this.itemStatus = itemstatuses;
      }))

      this.brandService.getAllList().then((brands => {
        this.brands = brands;
      }))

      this.subCategoryService.getAllList().then((subcategories => {
        this.subcategories = subcategories;
      }))

      this.categoryService.getAllList().then((categories => {
        this.categories = categories;
      }))

      this.unittypeService.getAllList().then((unittypes => {
        this.unittypes = unittypes;
      }))

      this.createForm();

      this.createView();
    }

    createView(){
      this.imageurl = 'assets/pending.gif';
      this.loadTable('');
    }

  createForm() {

    this.itemForm.controls['code'].setValidators([Validators.required]);
    this.itemForm.controls['name'].setValidators([Validators.required]);
    this.itemForm.controls['brand'].setValidators([Validators.required]);
    this.itemForm.controls['pprice'].setValidators([Validators.required]);
    this.itemForm.controls['sprice'].setValidators([Validators.required]);
    this.itemForm.controls['photo'].setValidators([Validators.required]);
    this.itemForm.controls['quantity'].setValidators([Validators.required]);
    this.itemForm.controls['rop'].setValidators([Validators.required]);
    this.itemForm.controls['dointroduced'].setValidators([Validators.required]);
    this.itemForm.controls['itemstatus'].setValidators([Validators.required]);
    this.itemForm.controls['unittype'].setValidators([Validators.required]);
    this.itemForm.controls['category'].setValidators([Validators.required]);
    this.itemForm.controls['subcategory'].setValidators([Validators.required]);

    Object.values(this.itemForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.itemForm.controls) {
      const control = this.itemForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dointroduced")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olditem != undefined && control.valid) {
            // @ts-ignore
            if (value === this.item[controlName]) {
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

    // this.enableButtons(true,false,false);

  }

  loadTable(query : string){
      this.itemService.getAll(query).then((items =>{
        this.items = items;
        this.imageurl = 'assets/fullfilled.png';
      }))
        .catch((error) => {
          console.log(error);
          this.imageurl = 'assets/rejected.png';
        })
        .finally(() => {
          this.data = new MatTableDataSource(this.items);
          this.data.paginator = this.paginator;
        });
    }

    search(){
      let itemName = this.itemSearchForm.controls['name'].value;
      let itemBrand = this.itemSearchForm.controls['brand'].value;

      let query = '';

      if (itemName != null){
        query = query + "&itemname=" + itemName;
      }

      if (itemBrand != null){
        query = query + "&brandname=" + itemBrand;
      }

      if (query != null) query = query.replace(/^./, '?');

      this.loadTable(query);

      console.log(itemName + itemBrand)
    }
    searchClear(){
      this.loadTable('');
      this.itemSearchForm.reset();
    }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageempurl = event.target.result;
        this.itemForm.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.itemForm.controls['photo'].setErrors({'required': true});
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dialogBox.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Item Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.item = this.itemForm.getRawValue();
      this.item.photo = btoa(this.imageempurl);

      let itemdata: string = "";

      itemdata = itemdata + "<br>Code is : " + this.item.code;
      itemdata = itemdata + "<br>Name is : " + this.item.name;

      const confirm = this.dialogBox.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Item Add",
          message: "Are you sure to Add the following Item ? <br> <br>" + itemdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.itemService.add(this.item).then((responce: [] | undefined) => {
            if (responce != undefined) {
              // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.itemForm.reset();
              this.clearImage();
              Object.values(this.itemForm.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dialogBox.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Item Add", message: addmessage}
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

    for (const controlName in this.itemForm.controls) {
      const control = this.itemForm.controls[controlName];
      if (control.errors) {
          errors = errors + "<br>Invalid " + controlName;
      }
    }

    return errors;
  }
}
