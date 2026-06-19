import { Division } from "./division";

export class Gnd {

  public id!: number;
  public name!: string;
  public division!: Division;

  constructor(id: number, name: string, division: Division) {
    this.id = id;
    this.name = name;
    this.division = division;
  }
}
