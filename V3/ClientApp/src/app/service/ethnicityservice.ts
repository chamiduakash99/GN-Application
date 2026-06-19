import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Ethnicity } from "../entity/ethnicity";

@Injectable({
  providedIn: 'root'
})
export class EthnicityService {

  private baseUrl = 'http://localhost:8080/ethnicity';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(ethnicity: Ethnicity): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + ethnicity.id, ethnicity).toPromise();
  }

  async getAll(query: string): Promise<Array<Ethnicity>> {
    const items = await this.http.get<Array<Ethnicity>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Ethnicity>> {
    const items = await this.http.get<Array<Ethnicity>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(ethnicity: Ethnicity): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, ethnicity).toPromise();
  }
}
