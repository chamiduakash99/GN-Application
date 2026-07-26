import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Cultivation} from '../entity/Cultivation';

@Injectable({providedIn: 'root'})
export class CultivationService {
  private readonly url = 'http://localhost:8080/cultivations';
  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Cultivation[]> {
    const finalUrl = query && query.trim() !== '' ? this.url + query : this.url;
    return this.http.get<Cultivation[]>(finalUrl).toPromise().then(res => res ?? []);
  }
  getAllList(): Promise<Cultivation[]> {
    return this.http.get<Cultivation[]>(this.url + '/list').toPromise().then(res => res ?? []);
  }
  add(cultivation: Cultivation): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, cultivation).toPromise().catch(error => {
      console.log('Add Error:', error); return undefined;
    });
  }
  update(cultivation: Cultivation): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, cultivation).toPromise();
  }
  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
