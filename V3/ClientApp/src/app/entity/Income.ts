import {Citizen} from './Citizen';

export class Income {
  public id!: number;
  public monthlyaverageincome!: number;
  public incomesource!: string;
  public citizen!: Citizen;

  constructor(
    id: number,
    monthlyaverageincome: number,
    incomesource: string,
    citizen: Citizen
  ) {
    this.id = id;
    this.monthlyaverageincome = monthlyaverageincome;
    this.incomesource = incomesource;
    this.citizen = citizen;
  }
}
