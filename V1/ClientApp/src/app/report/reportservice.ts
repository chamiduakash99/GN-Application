import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CountByStreetMaterial } from "./entity/countbystreetmaterial";

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
}
