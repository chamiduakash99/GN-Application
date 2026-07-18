import {Citizen} from './Citizen';

export class Household {
  public id!: number;
  public householdno!: string;
  public address!: string;
  public registrationdate!: string;
  public headcitizenId!: number;
  public citizensById!: Citizen[];

  constructor(
    id: number,
    householdno: string,
    address?: string,
    registrationdate?: string,
    headcitizenId?: number,
    citizensById?: Citizen[]
  ) {
    this.id = id;
    this.householdno = householdno;
    this.address = address ?? '';
    this.registrationdate = registrationdate ?? '';
    this.headcitizenId = headcitizenId ?? 0;
    this.citizensById = citizensById ?? [];
  }
}
