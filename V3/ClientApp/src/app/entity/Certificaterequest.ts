import {Citizen} from "./Citizen";
import {Certificatetype} from "./Certificatetype";
import {Requeststatus} from "./Requeststatus";

export class Certificaterequest {

  public id !: number;
  public purpose !: string;
  public requesteddate !: string;
  public rejectreason !: string;
  public updateddate !: string;

  public citizen !: Citizen;
  public certificatetype !: Certificatetype;
  public requeststatus !: Requeststatus;


  constructor(
    id:number,
    purpose:string,
    requesteddate:string,
    rejectreason:string,
    updateddate:string,
    citizen:Citizen,
    certificatetype:Certificatetype,
    requeststatus:Requeststatus
  ) {

    this.id = id;
    this.purpose = purpose;
    this.requesteddate = requesteddate;
    this.rejectreason = rejectreason;
    this.updateddate = updateddate;

    this.citizen = citizen;
    this.certificatetype = certificatetype;
    this.requeststatus = requeststatus;

  }

}
