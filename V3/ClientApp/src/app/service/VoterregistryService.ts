import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Voterregistry} from '../entity/Voterregistry';

@Injectable({
  providedIn: 'root'
})
export class VoterregistryService {

  private readonly url = 'http://localhost:8080/voterregistry';

  constructor(private http: HttpClient) {}

  // All registry entries
  getAll(): Promise<Voterregistry[]> {
    return this.http.get<Voterregistry[]>(this.url)
      .toPromise()
      .then(res => res ?? []);
  }

  // Entries for a specific household
  getByHousehold(householdId: number): Promise<Voterregistry[]> {
    return this.http.get<Voterregistry[]>(`${this.url}/household/${householdId}`)
      .toPromise()
      .then(res => res ?? []);
  }

  // Household summary for upper table
  getHouseholdSummary(): Promise<any[]> {
    return this.http.get<any[]>(`${this.url}/household-summary`)
      .toPromise()
      .then(res => res ?? []);
  }

  // Total voter count
  getTotalCount(): Promise<any> {
    return this.http.get<any>(`${this.url}/count`)
      .toPromise()
      .then(res => res ?? {totalvoters: 0});
  }

  // Generate / regenerate registry
  generate(): Promise<any> {
    return this.http.post<any>(`${this.url}/generate`, {})
      .toPromise()
      .then(res => res ?? {errors: 'No response', generated: '0'});
  }

  // Remove a single entry manually
  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
