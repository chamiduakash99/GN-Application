import { Streetstatus } from "./Streetstatus";
import { Streettype } from "./Streettype";
import { Streetmatierial } from "./Streetmatierial";

export class Street {

  public id!: number;
  public codename!: string;
  public fullname!: string;
  public mapimage!: string; // For frontend, usually base64 string
  public startlatitude!: number;
  public startlongitude!: number;
  public endlatitude!: number;
  public endlongitude!: number;
  public length!: number; 
  public width!: number;
  public streetstatus!: Streetstatus;
  public streettype!: Streettype;
  public streetmatierial!: Streetmatierial;

  constructor(
    id: number,
    codename: string,
    fullname: string,
    mapimage: string,
    startlatitude: number,
    startlongitude: number,
    endlatitude: number,
    endlongitude: number,
    length: number,
    width: number,
    streetstatus: Streetstatus,
    streettype: Streettype,
    streetmatierial: Streetmatierial
  ) {
    this.id = id;
    this.codename = codename;
    this.fullname = fullname;
    this.mapimage = mapimage;
    this.startlatitude = startlatitude;
    this.startlongitude = startlongitude;
    this.endlatitude = endlatitude;
    this.endlongitude = endlongitude;
    this.length = length;
    this.width = width;
    this.streetstatus = streetstatus;
    this.streettype = streettype;
    this.streetmatierial = streetmatierial;
  }
}
