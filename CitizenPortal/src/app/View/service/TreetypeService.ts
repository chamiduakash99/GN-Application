import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Treetype} from '../entity/Treetype';

@Injectable({
  providedIn: 'root'
})
export class TreetypeService {

  private readonly url = 'http://localhost:8080/treetypes';

  constructor(private http: HttpClient) {}

  getAll(): Promise<Treetype[]> {
    return this.http.get<Treetype[]>(this.url)
      .toPromise()
      .then(res => res ?? []);
  }

  getAllList(): Promise<Treetype[]> {
    return this.http.get<Treetype[]>(this.url + '/list')
      .toPromise()
      .then(res => res ?? []);
  }
}
