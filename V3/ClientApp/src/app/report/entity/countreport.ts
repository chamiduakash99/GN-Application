export class countreport {
  public id!: number;
  public name!: string;
  public count!: number;
  public percentage!: number;
  public value!: number;

  constructor(id: number, name: string, count: number, percentage: number, value?: number) {
    this.id = id;
    this.name = name;
    this.count = count;
    this.percentage = percentage;
    this.value = value ?? 0;
  }
}
