import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Harvest} from '../entity/Harvest';

@Injectable({providedIn: 'root'})
export class HarvestService {
  private readonly url = 'http://localhost:8080/harvests';
  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Harvest[]> {
    const finalUrl = query && query.trim() !== '' ? this.url + query : this.url;
    return this.http.get<Harvest[]>(finalUrl).toPromise().then(res => res ?? []);
  }
  add(harvest: Harvest): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, harvest).toPromise().catch(error => {
      console.log('Add Error:', error); return undefined;
    });
  }
  update(harvest: Harvest): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, harvest).toPromise();
  }
  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
