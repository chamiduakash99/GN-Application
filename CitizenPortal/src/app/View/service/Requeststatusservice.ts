import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Requeststatus} from '../entity/Requeststatus';

@Injectable({
  providedIn: 'root'
})
export class RequestStatusService {

  readonly url = 'http://localhost:8080/requeststatuses';

  constructor(private http: HttpClient) {}

  getAllList(): Promise<Requeststatus[]> {
    return this.http.get<Requeststatus[]>(`${this.url}/list`).toPromise() as Promise<Requeststatus[]>;
  }
}


// import {Injectable} from "@angular/core";
// import {HttpClient} from "@angular/common/http";
//
// import {Requeststatus} from "../entity/Requeststatus";
//
// @Injectable({
//   providedIn: 'root'
// })
//
// export class RequeststatusService {
//
//   constructor(private http: HttpClient) { }
//
//   async getAll(): Promise<Array<Requeststatus>> {
//
//     const requeststatuses = await this.http.get<Array<Requeststatus>>(
//       'http://localhost:8080/requeststatuses'
//     ).toPromise();
//
//     if(requeststatuses == undefined){
//       return [];
//     }
//
//     return requeststatuses;
//
//   }
//
//   async getAllList(): Promise<Array<Requeststatus>> {
//
//     const requeststatuses = await this.http.get<Array<Requeststatus>>(
//       'http://localhost:8080/requeststatuses/list'
//     ).toPromise();
//
//     if(requeststatuses == undefined){
//       return [];
//     }
//
//     return requeststatuses;
//
//   }
//
// }
