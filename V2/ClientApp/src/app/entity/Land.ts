import { Street } from "./Street";
import { Landtype } from "./Landtype";
import { Citizen } from "./Citizen";
import { Fencetype } from "./Fencetype";
import { Landfeaturedetails } from "./Landfeaturedetails";
import {Userrole} from "./userrole";

export class Land {
  public id!: number;
  public street!: Street;
  public latitude!: number;
  public longitude!: number;
  public size!: number;
  public landtype!: Landtype;
  public citizen!: Citizen;
  public image!: string; // base64 string or url
  public deed!: string;  // base64 string or url
  public fencetype!: Fencetype;
  public remarks!: string;
  public landfeaturedetails!:Array<Landfeaturedetails>;

  constructor(
    id: number,
    street: Street,
    latitude: number,
    longitude: number,
    size: number,
    landtype: Landtype,
    citizen: Citizen,
    image: string,
    deed: string,
    fencetype: Fencetype,
    remarks: string,
    landfeaturedetails: Array<Landfeaturedetails>
  ) {
    this.id = id;
    this.street = street;
    this.latitude = latitude;
    this.longitude = longitude;
    this.size = size;
    this.landtype = landtype;
    this.citizen = citizen;
    this.image = image;
    this.deed = deed;
    this.fencetype = fencetype;
    this.remarks = remarks;
    this.landfeaturedetails = landfeaturedetails;
  }
}
