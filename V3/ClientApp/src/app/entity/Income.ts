import { OwnershipType } from "./ownershiptype";
import { Usage } from "./usage";
import { Buildingtype } from "./buildingtype";
import { Walltype } from "./walltype";
import { Floortype } from "./floortype";
import { Rooftype } from "./rooftype";
import { Land } from "./Land";
import {Street} from "./Street";
import { Citizen } from "./Citizen";

export class Building {

  public id!: number;
  public no!: string;
  street!: Street;
  citizen!: Citizen;

  public ownershiptype!: OwnershipType;
  public usage!: Usage;
  public buildingtype!: Buildingtype;
  public walltype!: Walltype;
  public floortype!: Floortype;
  public rooftype!: Rooftype;
  public landdetail!: Land;
  public image!: string;

  constructor(
    id: number,
    no: string,
    ownershiptype: OwnershipType,
    usage: Usage,
    buildingtype: Buildingtype,
    walltype: Walltype,
    floortype: Floortype,
    rooftype: Rooftype,
    landdetail: Land
  ) {
    this.id = id;
    this.no = no;
    this.ownershiptype = ownershiptype;
    this.usage = usage;
    this.buildingtype = buildingtype;
    this.walltype = walltype;
    this.floortype = floortype;
    this.rooftype = rooftype;
    this.landdetail = landdetail;
  }
}
