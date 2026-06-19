import {Citizen} from "./Citizen";
import {Complaintstatus} from "./Complaintstatus";
import {Employee} from "./employee";

export class Complaint {

  public id !: number;
  public subject !: string;
  public description !: string;
  public complaineddate !: string;
  public rejectreason !: string;
  public actiontaken !: string;
  public referredto !: string;
  public citizen !: Citizen;
  public complaintstatus !: Complaintstatus;
  public employee !: Employee;

  constructor(
    id: number,
    subject: string,
    description: string,
    complaineddate: string,
    rejectreason: string,
    actiontaken: string,
    referredto: string,
    citizen: Citizen,
    complaintstatus: Complaintstatus,
    employee: Employee
  ) {
    this.id = id;
    this.subject = subject;
    this.description = description;
    this.complaineddate = complaineddate;
    this.rejectreason = rejectreason;
    this.actiontaken = actiontaken;
    this.referredto = referredto;
    this.citizen = citizen;
    this.complaintstatus = complaintstatus;
    this.employee = employee;
  }
}
