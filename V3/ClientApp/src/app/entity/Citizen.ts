import {Landfeaturedetails} from "./Landfeaturedetails";
import {Citizenaidprogram} from "./Citizenaidprogram";
import {Citizenguardian} from "./Citizenguardian";

export class Citizen {
  public id!: number;
  public name!: string;
  public nic!: string;

  public namewithinitials!: string;
  public dateofbirth!: Date;
  public mobileno!: string;
  public email!: string;
  public isconvicted!: number;
  public medicalconditions!: string;
  public remarks!: string;

  public religion!: any;
  public matiralstatus!: any;
  public educationlevel!: any;
  public ethnicity!: any;
  public gender!: any;

  public citizenaidprograms!:Array<Citizenaidprogram>;
  public citizenguardians!:Array<Citizenguardian>;

  public birthcetificateno!: string;

  constructor(id: number, name: string, nic: string) {
    this.id = id;
    this.name = name;
    this.nic = nic;

    this.citizenaidprograms = [];
    this.citizenguardians = [];
  }
}
