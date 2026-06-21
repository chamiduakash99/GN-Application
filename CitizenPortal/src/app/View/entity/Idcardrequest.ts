import {Citizen} from './Citizen';
import {Employee} from './employee';
import {Reason} from './Reason';
import {Idcardrequeststatus} from './Idcardrequeststatus';

export class Idcardrequest {
  public id!: number;
  public bcnooridno!: string;
  public complaintdate!: string;
  public complaintpolicestation!: string;
  public complaintno!: string;
  public applieddate!: string;
  public rejectreason!: string;
  public reason!: Reason;
  public idcardrequeststatus!: Idcardrequeststatus;
  public citizen!: Citizen;
  public employee!: Employee;

  constructor(
    id: number,
    bcnooridno: string,
    complaintdate: string,
    complaintpolicestation: string,
    complaintno: string,
    applieddate: string,
    rejectreason: string,
    reason: Reason,
    idcardrequeststatus: Idcardrequeststatus,
    citizen: Citizen,
    employee: Employee
  ) {
    this.id = id;
    this.bcnooridno = bcnooridno;
    this.complaintdate = complaintdate;
    this.complaintpolicestation = complaintpolicestation;
    this.complaintno = complaintno;
    this.applieddate = applieddate;
    this.rejectreason = rejectreason;
    this.reason = reason;
    this.idcardrequeststatus = idcardrequeststatus;
    this.citizen = citizen;
    this.employee = employee;
  }
}
