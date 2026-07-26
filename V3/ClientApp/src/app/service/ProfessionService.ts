import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profession} from '../entity/Profession';

@Injectable({providedIn: 'root'})
export class ProfessionService {
  private readonly url = 'http://localhost:8080/professions';
  constructor(private http: HttpClient) {}

  getAll(): Promise<Profession[]> {
    return this.http.get<Profession[]>(this.url).toPromise().then(res => res ?? []);
  }
  getAllList(): Promise<Profession[]> {
    return this.http.get<Profession[]>(this.url + '/list').toPromise().then(res => res ?? []);
  }
}
