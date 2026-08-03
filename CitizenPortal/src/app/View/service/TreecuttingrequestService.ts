import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Treecuttingrequest} from '../entity/Treecuttingrequest';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TreecuttingrequestService {

  private readonly url = 'http://localhost:8080/treecuttingrequests';

  constructor(private http: HttpClient) {}

  getAll(query: string): Promise<Treecuttingrequest[]> {
    const finalUrl = query && query.trim() !== ''
      ? this.url + query
      : this.url;
    return this.http.get<Treecuttingrequest[]>(finalUrl)
      .toPromise()
      .then(res => res ?? []);
  }

  add(request: Treecuttingrequest): Promise<[] | undefined> {
    return this.http.post<[]>(this.url, request).toPromise().catch(error => {
      console.log('Add Error:', error);
      return undefined;
    });
  }

  update(id: number, request: Treecuttingrequest): Promise<[] | undefined> {
    return this.http.put<[]>(this.url + '/' + id + '/citizenupdate', request).toPromise().catch(error => {
      console.log('Update Error:', error);
      return undefined;
    });
  }

  // update(request: Treecuttingrequest): Promise<[] | undefined> {
  //   return this.http.put<[]>(this.url, request).toPromise();
  // }

  delete(id: number): Promise<[] | undefined> {
    return this.http.delete<[]>(`${this.url}/${id}`).toPromise();
  }

  approve(id: number): Promise<[] | undefined> {
    return this.http.put<[]>(`${this.url}/${id}/approve`, {}).toPromise();
  }

  reject(id: number, rejectReason: string): Promise<[] | undefined> {
    return this.http.put<[]>(
      `${this.url}/${id}/reject?rejectReason=${encodeURIComponent(rejectReason)}`, {}
    ).toPromise();
  }

  uploadPermit(id: number, pdfBytes: Uint8Array): Promise<[] | undefined> {
    return this.http.put<[]>(
      `${this.url}/${id}/uploadpermit`, pdfBytes,
      {headers: {'Content-Type': 'application/octet-stream'}}
    ).toPromise();
  }

  uploadTransport(id: number, pdfBytes: Uint8Array): Promise<[] | undefined> {
    return this.http.put<[]>(
      `${this.url}/${id}/uploadtransport`, pdfBytes,
      {headers: {'Content-Type': 'application/octet-stream'}}
    ).toPromise();
  }

  downloadPermitPdf(id: number): Promise<ArrayBuffer | undefined> {
    return this.http.get(
      `${this.url}/${id}/permitpdf`,
      { responseType: 'arraybuffer' }
    ).toPromise();
  }

  downloadTransportPdf(id: number): Promise<ArrayBuffer | undefined> {
    return this.http.get(
      `${this.url}/${id}/transportpdf`,
      { responseType: 'arraybuffer' }
    ).toPromise();
  }
}
