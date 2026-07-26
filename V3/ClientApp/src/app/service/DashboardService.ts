import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly base = 'http://localhost:8080/dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Promise<any> {
    return firstValueFrom(this.http.get<any>(`${this.base}/summary`))
      .catch(() => ({}));
  }

  getCertRequestSummary(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.base}/certificaterequests/summary`))
      .catch(() => []);
  }

  getComplaintSummary(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.base}/complaints/summary`))
      .catch(() => []);
  }

  getIdCardSummary(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.base}/idcardrequests/summary`))
      .catch(() => []);
  }

  getTreeCuttingSummary(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.base}/treecuttingrequests/summary`))
      .catch(() => []);
  }

  getCultivationSummary(): Promise<any[]> {
    return firstValueFrom(this.http.get<any[]>(`${this.base}/cultivations/summary`))
      .catch(() => []);
  }
}
