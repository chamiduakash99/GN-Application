import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Province } from "../entity/province";

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  private baseUrl = 'http://localhost:8080/province';

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Province>> {
    const list = await this.http.get<Array<Province>>(this.baseUrl + '/list').toPromise();
    if (list == undefined) {
      return [];
    }
    return list;
  }

  async getById(id: number): Promise<Province | undefined> {
    return this.http.get<Province>(`${this.baseUrl}/${id}`).toPromise();
  }

}
