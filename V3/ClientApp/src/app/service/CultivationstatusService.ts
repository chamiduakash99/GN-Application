import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Croptype} from '../entity/Croptype';

@Injectable({providedIn: 'root'})
export class CroptypeService {
  private readonly url = 'http://localhost:8080/croptypes';
  constructor(private http: HttpClient) {}

  getAll(): Promise<Croptype[]> {
    return this.http.get<Croptype[]>(this.url).toPromise().then(res => res ?? []);
  }
  getAllList(): Promise<Croptype[]> {
    return this.http.get<Croptype[]>(this.url + '/list').toPromise().then(res => res ?? []);
  }
}
