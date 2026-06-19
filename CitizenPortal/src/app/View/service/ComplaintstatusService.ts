import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Complaintstatus} from '../entity/Complaintstatus';

@Injectable({
  providedIn: 'root'
})
export class ComplaintStatusService {

  private readonly url = 'http://localhost:8080/complaintstatuses';

  constructor(private http: HttpClient) {}

  getAllList(): Promise<Complaintstatus[]> {
    return this.http.get<Complaintstatus[]>(this.url)
      .toPromise()
      .then(res => res ?? []);
  }
}
