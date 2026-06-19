export class CountByStreetMaterial {
  public id!: number;
  public streetMaterial!: string;
  public count!: number;
  public percentage!: number;

  constructor(id: number, streetMaterial: string, count: number, percentage: number) {
    this.id = id;
    this.streetMaterial = streetMaterial;
    this.count = count;
    this.percentage = percentage;
  }
}
