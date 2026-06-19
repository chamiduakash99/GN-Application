import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Complaint} from '../entity/Complaint';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private readonly url = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Complaint[]> {
    const finalUrl =
      query && query.trim() !== ''
        ? this.url + '/complaints' + query
        : this.url + '/complaints';

    return this.http.get<Complaint[]>(finalUrl)
      .toPromise()
      .then(res => res ?? []);
  }

  getStatusSummary(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>('http://localhost:8080/complaints/status-summary')
    ).then(res => res ?? []);
  }

  add(complaint: Complaint): Promise<[] | undefined> {
    return this.http.post<[]>(this.url + '/complaints', complaint).toPromise().catch((error) => {
      console.log('Add Error:', error);
      return undefined;
    });
  }

  update(complaint: Complaint): Promise<[] | undefined> {
    return this.http.put<[]>(this.url + '/complaints', complaint).toPromise();
  }

  approve(id: number, actiontaken: string, referredto: string, employeeid: number): Promise<[] | undefined> {
    let query = `?actiontaken=${encodeURIComponent(actiontaken)}&employeeid=${employeeid}`;
    if (referredto && referredto.trim() !== '') {
      query += `&referredto=${encodeURIComponent(referredto)}`;
    }
    return this.http.put<[]>(`${this.url}/complaints/${id}/approve${query}`, {}).toPromise();
  }

  reject(id: number, rejectreason: string, employeeid: number): Promise<[] | undefined> {
    return this.http.put<[]>(
      `${this.url}/complaints/${id}/reject?rejectreason=${encodeURIComponent(rejectreason)}&employeeid=${employeeid}`,
      {}
    ).toPromise();
  }

  // statusid: 4 = Investigating, 5 = Resolved, 6 = Passed to Authorities
  updateStatus(id: number, statusid: number, employeeid: number): Promise<[] | undefined> {
    return this.http.put<[]>(
      `${this.url}/complaints/${id}/status?statusid=${statusid}&employeeid=${employeeid}`,
      {}
    ).toPromise();
  }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/complaints/${id}`).toPromise();
  }
}
