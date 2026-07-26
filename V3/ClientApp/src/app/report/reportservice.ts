import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CountByStreetMaterial } from "./entity/countbystreetmaterial";
import {landreport} from "./entity/landreport";
import {fencereport} from "./entity/fencereport";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  async countByStreetMaterial(): Promise<CountByStreetMaterial[]> {
    const data = await this.http.get<CountByStreetMaterial[]>('http://localhost:8080/reports/countbystreetmaterial').toPromise();
    if (!data) {
      return [];
    }
    return data;
  }

  async landreport(): Promise<landreport[]> {
    const data = await this.http.get<landreport[]>('http://localhost:8080/reports/landreport').toPromise();
    if (!data) {
      return [];
    }

    return data;
  }
  async fencereport(): Promise<fencereport[]> {
    const data = await this.http.get<fencereport[]>('http://localhost:8080/reports/fencereport').toPromise();
    if (!data) {
      return [];
    }

    return data;
  }



}
