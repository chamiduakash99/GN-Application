import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Treepermissionstatus} from '../entity/Treepermissionstatus';

@Injectable({
  providedIn: 'root'
})
export class TreepermissionstatusService {

  private readonly url = 'http://localhost:8080/treepermissionstatuses';

  constructor(private http: HttpClient) {}

  getAll(): Promise<Treepermissionstatus[]> {
    return this.http.get<Treepermissionstatus[]>(this.url)
      .toPromise()
      .then(res => res ?? []);
  }

  getAllList(): Promise<Treepermissionstatus[]> {
    return this.http.get<Treepermissionstatus[]>(this.url + '/list')
      .toPromise()
      .then(res => res ?? []);
  }
}
