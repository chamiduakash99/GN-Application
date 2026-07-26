export class fencereport {
  public id!: number;
  public fencetype!: string;
  public count!: number;
  public percentage!: number;

  constructor(id: number, fencetype: string, count: number, percentage: number) {
    this.id = id;
    this.fencetype = fencetype;
    this.count = count;
    this.percentage = percentage;
  }
}
