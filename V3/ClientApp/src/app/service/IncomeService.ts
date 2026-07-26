import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Income} from '../entity/Income';

@Injectable({providedIn: 'root'})
export class IncomeService {
  private readonly url = 'http://localhost:8080/incomes';
  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Income[]> {
    const finalUrl = query && query.trim() !== '' ? this.url + query : this.url;
    return this.http.get<Income[]>(finalUrl).toPromise().then(res => res ?? []);
  }
  getByCitizen(citizenId: number): Promise<Income | null> {
    return this.http.get<Income>(`${this.url}/citizen/${citizenId}`)
      .toPromise()
      .then(res => res ?? null)
      .catch(() => null);
  }
  add(income: Income): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, income).toPromise().catch(error => {
      console.log('Add Error:', error); return undefined;
    });
  }
  update(income: Income): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, income).toPromise();
  }
  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
