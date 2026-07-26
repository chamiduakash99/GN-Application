import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Citizenskill} from '../entity/Citizenskill';

@Injectable({providedIn: 'root'})
export class CitizenskillService {
  private readonly url = 'http://localhost:8080/citizenskills';
  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Citizenskill[]> {
    const finalUrl = query && query.trim() !== '' ? this.url + query : this.url;
    return this.http.get<Citizenskill[]>(finalUrl).toPromise().then(res => res ?? []);
  }
  add(skill: Citizenskill): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, skill).toPromise().catch(error => {
      console.log('Add Error:', error); return undefined;
    });
  }
  update(skill: Citizenskill): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, skill).toPromise();
  }
  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
