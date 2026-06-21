import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Reason} from '../entity/Reason';

@Injectable({
  providedIn: 'root'
})
export class ReasonService {

  private readonly url = 'http://localhost:8080/reasons';

  constructor(private http: HttpClient) {}

  getAll(): Promise<Reason[]> {
    return this.http.get<Reason[]>(this.url)
      .toPromise()
      .then(res => res ?? []);
  }

  getAllList(): Promise<Reason[]> {
    return this.http.get<Reason[]>(this.url + '/list')
      .toPromise()
      .then(res => res ?? []);
  }
}
