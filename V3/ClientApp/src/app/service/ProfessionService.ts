import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Areaunit} from '../entity/Areaunit';

@Injectable({providedIn: 'root'})
export class AreaunitService {
  private readonly url = 'http://localhost:8080/areaunits';
  constructor(private http: HttpClient) {}

  getAll(): Promise<Areaunit[]> {
    return this.http.get<Areaunit[]>(this.url).toPromise().then(res => res ?? []);
  }
  getAllList(): Promise<Areaunit[]> {
    return this.http.get<Areaunit[]>(this.url + '/list').toPromise().then(res => res ?? []);
  }
}
