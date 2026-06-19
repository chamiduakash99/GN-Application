import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { District } from "../entity/district";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private baseUrl = 'http://localhost:8080/district';

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<District>> {
    const list = await this.http.get<Array<District>>(this.baseUrl + '/list').toPromise();
    if (list == undefined) {
      return [];
    }
    return list;
  }

  async getById(id: number): Promise<District | undefined> {
    return this.http.get<District>(`${this.baseUrl}/${id}`).toPromise();
  }

}
