import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Certificate} from '../entity/certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  readonly url = 'http://localhost:8080/certificates';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Certificate[]> {
    return this.http.get<Certificate[]>(this.url + query).toPromise() as Promise<Certificate[]>;
  }

  add(certificate: Certificate): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, certificate).toPromise();
  }

  update(certificate: Certificate): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, certificate).toPromise();
  }

  uploadScan(id: number, scannedCopy: Uint8Array): Promise<[] | undefined> {
    return this.http.put<[]>(`${this.url}/${id}/upload`, scannedCopy).toPromise();
  }

  markPickedUp(id: number): Promise<[] | undefined> {
    return this.http.put<[]>(`${this.url}/${id}/pickup`, {}).toPromise();
  }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}

// import {Injectable} from "@angular/core";
// import {HttpClient} from "@angular/common/http";
//
// import {Certificate} from "../entity/Certificate";
//
// @Injectable({
//   providedIn: 'root'
// })
//
// export class CertificateService {
//
//   constructor(private http: HttpClient) { }
//
//
//   async delete(id: number): Promise<[] | undefined> {
//
//     // @ts-ignore
//     return this.http.delete(
//       'http://localhost:8080/certificates/' + id
//     ).toPromise();
//
//   }
//
//
//   async update(certificate: Certificate): Promise<[] | undefined> {
//
//     return this.http.put<[]>(
//       'http://localhost:8080/certificates',
//       certificate
//     ).toPromise();
//
//   }
//
//
//   async getAll(query:string): Promise<Array<Certificate>> {
//
//     const certificates = await this.http.get<Array<Certificate>>(
//       'http://localhost:8080/certificates' + query
//     ).toPromise();
//
//     if(certificates == undefined){
//       return [];
//     }
//
//     return certificates;
//
//   }
//
//
//   async getAllListNameId(): Promise<Array<Certificate>> {
//
//     const certificates = await this.http.get<Array<Certificate>>(
//       'http://localhost:8080/certificates/list'
//     ).toPromise();
//
//     if(certificates == undefined){
//       return [];
//     }
//
//     return certificates;
//
//   }
//
//
//   async add(certificate: Certificate): Promise<[] | undefined> {
//
//     return this.http.post<[]>(
//       'http://localhost:8080/certificates',
//       certificate
//     ).toPromise();
//
//   }
//
// }
