import {Citizen} from "./Citizen";
import {Employee} from "./employee";
import {Complaintstatus} from "./Complaintstatus";

export class Complaint {
  public id!: number;
  public subject!: string;
  public description!: string;
  public complaineddate!: string;
  public rejectreason!: string;
  public actiontaken!: string;
  public referredto!: string;
  public citizen!: Citizen;
  public employee!: Employee;
  public complaintstatus!: Complaintstatus;

  constructor(
    id: number,
    subject: string,
    description: string,
    complaineddate: string,
    rejectreason: string,
    actiontaken: string,
    referredto: string,
    citizen: Citizen,
    employee: Employee,
    complaintstatus: Complaintstatus
  ) {
    this.id = id;
    this.subject = subject;
    this.description = description;
    this.complaineddate = complaineddate;
    this.rejectreason = rejectreason;
    this.actiontaken = actiontaken;
    this.referredto = referredto;
    this.citizen = citizen;
    this.employee = employee;
    this.complaintstatus = complaintstatus;
  }
}
