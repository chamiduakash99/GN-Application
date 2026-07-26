import {Cultivation} from './Cultivation';

export class Harvest {
  public id!: number;
  public harvestdate!: string;
  public quantity!: number;
  public qualityremarks!: string;
  public cultivation!: Cultivation;

  constructor(
    id: number,
    harvestdate: string,
    quantity: number,
    qualityremarks: string,
    cultivation: Cultivation
  ) {
    this.id = id;
    this.harvestdate = harvestdate;
    this.quantity = quantity;
    this.qualityremarks = qualityremarks;
    this.cultivation = cultivation;
  }
}
