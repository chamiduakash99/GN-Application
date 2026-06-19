import {Employee} from "./employee";
import {Certificaterequest} from "./certificaterequest";

export class Certificate {

  public id !: number;
  public certificateno !: string;
  public issueddate !: string;
  public expirydate !: string;
  public scannedcopy !: string;
  public hardcopypicked !: number;
  public pickeddate !: string;

  public employee !: Employee;
  public certificaterequest !: Certificaterequest;



  constructor(
    id:number,
    certificateno:string,
    issueddate:string,
    expirydate:string,
    scannedcopy:string,
    hardcopypicked:number,
    pickeddate:string,
    employee:Employee,
    certificaterequest:Certificaterequest
  ) {

    this.id = id;
    this.certificateno = certificateno;
    this.issueddate = issueddate;
    this.expirydate = expirydate;
    this.scannedcopy = scannedcopy;
    this.hardcopypicked = hardcopypicked;
    this.pickeddate = pickeddate;

    this.employee = employee;
    this.certificaterequest = certificaterequest;

  }

}
