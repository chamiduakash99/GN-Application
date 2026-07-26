import {Citizen} from './Citizen';
import {Profession} from './Profession';

export class Citizenskill {
  public id!: number;
  public experienceyears!: number;
  public citizen!: Citizen;
  public profession!: Profession;

  constructor(
    id: number,
    experienceyears: number,
    citizen: Citizen,
    profession: Profession
  ) {
    this.id = id;
    this.experienceyears = experienceyears;
    this.citizen = citizen;
    this.profession = profession;
  }
}
