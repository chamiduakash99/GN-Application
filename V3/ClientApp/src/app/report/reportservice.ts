import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { countreport } from "./entity/countreport";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  async getCountReport(path: string): Promise<countreport[]> {
    const data = await this.http.get<countreport[]>('http://localhost:8080/reports/' + path).toPromise();
    if (!data) {
      return [];
    }
    return data;
  }
}
