export class Croptype {
  public id!: number;
  public name!: string;
  public growthperioddays!: number;
  public description!: string;

  constructor(id: number, name: string, growthperioddays?: number, description?: string) {
    this.id = id;
    this.name = name;
    this.growthperioddays = growthperioddays ?? 0;
    this.description = description ?? '';
  }
}
