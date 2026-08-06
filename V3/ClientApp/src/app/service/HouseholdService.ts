import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Household} from '../entity/Household';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService {

  private readonly url = 'http://localhost:8080/households';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Household[]> {
    const finalUrl = query && query.trim() !== ''
      ? this.url + query
      : this.url;
    return this.http.get<Household[]>(finalUrl)
      .toPromise()
      .then(res => res ?? []);
  }

  getAllList(): Promise<Household[]> {
    return this.http.get<Household[]>(this.url + '/list')
      .toPromise()
      .then(res => res ?? []);
  }

  add(household: Household): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, household).toPromise().catch(error => {
      console.log('Add Error:', error);
      return undefined;
    });
  }

  update(household: Household): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, household).toPromise();
  }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }

  // ── Membership ─────────────────────────────────────────────────────────────
  addMember(householdId: number, citizenId: number): Promise<any> {
    return this.http.put<any>(`${this.url}/${householdId}/members/${citizenId}`, {}).toPromise();
  }

  removeMember(householdId: number, citizenId: number): Promise<any> {
    return this.http.delete<any>(`${this.url}/${householdId}/members/${citizenId}`).toPromise();
  }

  /** citizens not yet attached to any household */
  unassignedCitizens(): Promise<any[]> {
    return this.http.get<any[]>(`${this.url}/unassignedcitizens`).toPromise().then(r => r ?? []);
  }
}
