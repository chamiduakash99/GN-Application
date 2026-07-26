import {Citizen} from './Citizen';
import {Land} from './Land';
import {Croptype} from './Croptype';
import {Cultivationstatus} from './Cultivationstatus';
import {Areaunit} from './Areaunit';
import {Harvest} from './Harvest';

export class Cultivation {
  public id!: number;
  public cultivationno!: string;
  public cultivatedarea!: number;
  public plantingdate!: string;
  public expectedharvestdate!: string;
  public remarks!: string;
  public landdetail!: Land;
  public citizen!: Citizen;
  public croptype!: Croptype;
  public cultivationstatus!: Cultivationstatus;
  public areaunit!: Areaunit;
  public harvests!: Harvest[];

  constructor(
    id: number,
    cultivationno: string,
    cultivatedarea: number,
    plantingdate: string,
    expectedharvestdate: string,
    remarks: string,
    landdetail: Land,
    citizen: Citizen,
    croptype: Croptype,
    cultivationstatus: Cultivationstatus,
    areaunit: Areaunit,
    harvests: Harvest[]
  ) {
    this.id = id;
    this.cultivationno = cultivationno;
    this.cultivatedarea = cultivatedarea;
    this.plantingdate = plantingdate;
    this.expectedharvestdate = expectedharvestdate;
    this.remarks = remarks;
    this.landdetail = landdetail;
    this.citizen = citizen;
    this.croptype = croptype;
    this.cultivationstatus = cultivationstatus;
    this.areaunit = areaunit;
    this.harvests = harvests;
  }
}
