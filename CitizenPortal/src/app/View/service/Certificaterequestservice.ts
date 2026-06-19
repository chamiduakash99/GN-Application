import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Certificaterequest} from '../entity/certificaterequest';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CertificateRequestService {

  private readonly url = 'http://localhost:8080/certificaterequests';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Certificaterequest[]> {

    // const finalUrl =
    //   query && query.trim() !== ''
    //     ? this.url + query
    //     : this.url + '/certificaterequests';
    // console.log(finalUrl)



    console.log(`${this.url}${query}`);

    return this.http.get<Certificaterequest[]>(`${this.url}${query}`)
      .toPromise()
      .then(res => res ?? []);
  }

  getStatusSummary(): Promise<any[]> {
    return firstValueFrom(
      this.http.get<any[]>('http://localhost:8080/certificaterequests/status-summary')
    ).then(res => res ?? []);
  }


  add(certificateRequest: Certificaterequest): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, certificateRequest).toPromise().catch((error) => {
      console.log('Add Error:', error);
      return undefined;
    });
  }
  // add(certificateRequest: Certificaterequest): Promise<[] | undefined> {
  //   return this.http.post<[]>(this.url, certificateRequest).toPromise();
  // }

  update(certificateRequest: Certificaterequest): Promise<[] | undefined> {
    return this.http.put<[]>(this.url, certificateRequest).toPromise();
  }

  approve(id: number): Promise<[] | undefined> {
    return this.http.put<[]>(`${this.url}/${id}/approve`, {}).toPromise();
  }

  reject(id: number, rejectReason: string): Promise<[] | undefined> {
    return this.http.put<[]>(`${this.url}/${id}/reject?rejectReason=${encodeURIComponent(rejectReason)}`, {}).toPromise();
  }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }
}

// import {Injectable} from "@angular/core";
// import {HttpClient} from "@angular/common/http";
//
// import {Certificaterequest} from "../entity/certificaterequest";
//
// @Injectable({
//   providedIn: 'root'
// })
//
// export class CertificaterequestService {
//
//   constructor(private http: HttpClient) { }
//
//   async delete(id: number): Promise<[] | undefined> {
//
//     // @ts-ignore
//     return this.http.delete(
//       'http://localhost:8080/certificaterequests/' + id
//     ).toPromise();
//
//   }
//
//
//   async update(certificaterequest: Certificaterequest): Promise<[] | undefined> {
//
//     return this.http.put<[]>(
//       'http://localhost:8080/certificaterequests',
//       certificaterequest
//     ).toPromise();
//
//   }
//
//
//   async getAll(query:string): Promise<Array<Certificaterequest>> {
//
//     const requests = await this.http.get<Array<Certificaterequest>>(
//       'http://localhost:8080/certificaterequests' + query
//     ).toPromise();
//
//     if(requests == undefined){
//       return [];
//     }
//
//     return requests;
//
//   }
//
//
//   async getAllListNameId(): Promise<Array<Certificaterequest>> {
//
//     const requests = await this.http.get<Array<Certificaterequest>>(
//       'http://localhost:8080/certificaterequests/list'
//     ).toPromise();
//
//     if(requests == undefined){
//       return [];
//     }
//
//     return requests;
//
//   }
//
//
//   async add(certificaterequest: Certificaterequest): Promise<[] | undefined> {
//
//     return this.http.post<[]>(
//       'http://localhost:8080/certificaterequests',
//       certificaterequest
//     ).toPromise();
//
//   }
//
// }
