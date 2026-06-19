import { Landfeature } from "./Landfeature";
import { Land } from "./Land";

export class Landfeaturedetails {
  public landfeature!: Landfeature;

  constructor(landfeature: Landfeature) {
    this.landfeature = landfeature;
  }
}
