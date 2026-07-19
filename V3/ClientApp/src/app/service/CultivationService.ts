import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Cultivationstatus} from '../entity/Cultivationstatus';

@Injectable({providedIn: 'root'})
export class CultivationstatusService {
  private readonly url = 'http://localhost:8080/cultivationstatuses';
  constructor(private http: HttpClient) {}

  getAll(): Promise<Cultivationstatus[]> {
    return this.http.get<Cultivationstatus[]>(this.url).toPromise().then(res => res ?? []);
  }
  getAllList(): Promise<Cultivationstatus[]> {
    return this.http.get<Cultivationstatus[]>(this.url + '/list').toPromise().then(res => res ?? []);
  }
}
