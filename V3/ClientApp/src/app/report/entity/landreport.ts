export class landreport {
  public id!: number;
  public landtype!: string;
  public count!: number;
  public percentage!: number;

  constructor(id: number, landtype: string, count: number, percentage: number) {
    this.id = id;
    this.landtype = landtype;
    this.count = count;
    this.percentage = percentage;
  }
}
