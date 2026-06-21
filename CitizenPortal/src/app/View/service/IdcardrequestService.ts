import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Idcardrequest} from '../entity/Idcardrequest';

@Injectable({
  providedIn: 'root'
})
export class IdcardrequestService {

  private readonly url = 'http://localhost:8080/idcardrequests';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Idcardrequest[]> {
    const finalUrl = query && query.trim() !== ''
      ? this.url + query
      : this.url;
    return this.http.get<Idcardrequest[]>(finalUrl)
      .toPromise()
      .then(res => res ?? []);
  }

  add(idcardrequest: Idcardrequest): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, idcardrequest).toPromise().catch((error) => {
      console.log('Add Error:', error);
      return undefined;
    });
  }

  update(idcardrequest: Idcardrequest): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, idcardrequest).toPromise();
  }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}
