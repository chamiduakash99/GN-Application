import {Citizen} from './Citizen';
import {Household} from './Household';

export class Voterregistry {
  public id!: number;
  public serialno!: number;
  public registereddate!: string;
  public citizen!: Citizen;
  public household!: Household;

  constructor(
    id: number,
    serialno: number,
    registereddate: string,
    citizen: Citizen,
    household: Household
  ) {
    this.id = id;
    this.serialno = serialno;
    this.registereddate = registereddate;
    this.citizen = citizen;
    this.household = household;
  }
}
