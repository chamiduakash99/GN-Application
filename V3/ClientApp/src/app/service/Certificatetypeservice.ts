import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Certificatetype} from '../entity/Certificatetype';

@Injectable({
  providedIn: 'root'
})
export class CertificateTypeService {

  readonly url = 'http://localhost:8080/certificatetypes';

  constructor(private http: HttpClient) {}

  getAllList(): Promise<Certificatetype[]> {
    return this.http.get<Certificatetype[]>(`${this.url}/list`).toPromise() as Promise<Certificatetype[]>;
  }
}


// import {Injectable} from "@angular/core";
// import {HttpClient} from "@angular/common/http";
//
// import {Certificatetype} from "../entity/Certificatetype";
//
// @Injectable({
//   providedIn: 'root'
// })
//
// export class CertificatetypeService {
//
//   constructor(private http: HttpClient) { }
//
//   async getAll(): Promise<Array<Certificatetype>> {
//
//     const certificatetypes = await this.http.get<Array<Certificatetype>>(
//       'http://localhost:8080/certificatetypes'
//     ).toPromise();
//
//     if(certificatetypes == undefined){
//       return [];
//     }
//
//     return certificatetypes;
//
//   }
//
//   async getAllList(): Promise<Array<Certificatetype>> {
//
//     const certificatetypes = await this.http.get<Array<Certificatetype>>(
//       'http://localhost:8080/certificatetypes/list'
//     ).toPromise();
//
//     if(certificatetypes == undefined){
//       return [];
//     }
//
//     return certificatetypes;
//
//   }
//
// }
