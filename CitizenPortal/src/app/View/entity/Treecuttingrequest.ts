  import {Citizen} from './Citizen';
  import {Employee} from './employee';
  import {Treetype} from './Treetype';
  import {Treepermissionstatus} from './Treepermissionstatus';

  export class Treecuttingrequest {
    public id!: number;
    public deedno!: string;
    public treecount!: number;
    public reasonforcutting!: string;
    public requesteddate!: string;
    public rejectreason!: string;
    public permitpdf!: string;
    public transportpdf!: string;

    // Transport section
    public needstransport!: boolean;
    public destination!: string;
    public vehicletype!: string;
    public vehiclenumber!: string;
    public transportdate!: string;

    // Relations
    public treetype!: Treetype;
    public treepermissionstatus!: Treepermissionstatus;
    public citizen!: Citizen;
    public employee!: Employee;

    constructor(
      id: number,
      deedno: string,
      treecount: number,
      reasonforcutting: string,
      requesteddate: string,
      rejectreason: string,
      permitpdf: string,
      transportpdf: string,
      needstransport: boolean,
      destination: string,
      vehicletype: string,
      vehiclenumber: string,
      transportdate: string,
      treetype: Treetype,
      treepermissionstatus: Treepermissionstatus,
      citizen: Citizen,
      employee: Employee
    ) {
      this.id = id;
      this.deedno = deedno;
      this.treecount = treecount;
      this.reasonforcutting = reasonforcutting;
      this.requesteddate = requesteddate;
      this.rejectreason = rejectreason;
      this.permitpdf = permitpdf;
      this.transportpdf = transportpdf;
      this.needstransport = needstransport;
      this.destination = destination;
      this.vehicletype = vehicletype;
      this.vehiclenumber = vehiclenumber;
      this.transportdate = transportdate;
      this.treetype = treetype;
      this.treepermissionstatus = treepermissionstatus;
      this.citizen = citizen;
      this.employee = employee;
    }
  }
