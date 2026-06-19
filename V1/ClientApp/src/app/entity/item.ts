import {ItemStatus} from "./itemstatus";
import {Brand} from "./brand";
import {Unittype} from "./unittype";
import {Subcategory} from "./subcategory";

export class Item {

  public id!: number;
  public code!: string;
  public name!: string;
  public pprice!: number;
  public sprice!: number;
  public photo!: string;
  public quantity!: number;
  public rop!: number;
  public dointroduced!: string;
  public itemstatus!: ItemStatus;
  public brand!: Brand;
  public unittype!: Unittype;
  public subcategory!: Subcategory;


  constructor(id: number, code: string, name: string, pprice: number, sprice: number, photo: string, quantity: number, rop: number, dointroduced: string, itemstatus: ItemStatus, brand: Brand, unittype: Unittype, subcategory: Subcategory) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.pprice = pprice;
    this.sprice = sprice;
    this.photo = photo;
    this.quantity = quantity;
    this.rop = rop;
    this.dointroduced = dointroduced;
    this.itemstatus = itemstatus;
    this.brand = brand;
    this.unittype = unittype;
    this.subcategory = subcategory;
  }
}
