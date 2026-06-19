
import {Aidprogram} from "./aidprogram";
import {Relationshiptype} from "./relationshiptype";
import {Citizen} from "./Citizen";

export class Citizenguardian {
  public  id!:number;
  public relationshiptype!:Relationshiptype;
  public citizenparent!: Citizen;

  constructor(id:number,relationshiptype: Relationshiptype,citizenparent:Citizen) {
    this.id = id;
    this.relationshiptype = relationshiptype;
    this.citizenparent = citizenparent;
  }
}
