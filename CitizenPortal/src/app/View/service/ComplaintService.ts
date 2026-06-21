import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Complaint} from '../entity/Complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private readonly url = 'http://localhost:8080/complaints';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Complaint[]> {
    const finalUrl = query && query.trim() !== ''
      ? this.url + query
      : this.url;
    return this.http.get<Complaint[]>(finalUrl)
      .toPromise()
      .then(res => res ?? []);
  }

  add(complaint: Complaint): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, complaint).toPromise().catch((error) => {
      console.log('Add Error:', error);
      return undefined;
    });
  }

  update(complaint: Complaint): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, complaint).toPromise();
  }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
