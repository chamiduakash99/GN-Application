import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Idcardrequeststatus} from '../entity/Idcardrequeststatus';

@Injectable({
  providedIn: 'root'
})
export class IdcardrequeststatusService {

  private readonly url = 'http://localhost:8080/idcardrequeststatus';

  constructor(private http: HttpClient) {}

  getAll(): Promise<Idcardrequeststatus[]> {
    return this.http.get<Idcardrequeststatus[]>(this.url)
      .toPromise()
      .then(res => res ?? []);
  }

  getAllList(): Promise<Idcardrequeststatus[]> {
    return this.http.get<Idcardrequeststatus[]>(this.url + '/list')
      .toPromise()
      .then(res => res ?? []);
  }
}
