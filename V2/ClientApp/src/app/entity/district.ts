import { Province } from "./province";

export class District {

  public id!: number;
  public name!: string;
  public province!: Province;

  constructor(id: number, name: string, province: Province) {
    this.id = id;
    this.name = name;
    this.province = province;
  }
}
