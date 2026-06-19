import { Landfeature } from "../entity/Landfeature";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LandfeatureService {

  private baseUrl = 'http://localhost:8080/landfeature';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(landfeature: Landfeature): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + landfeature.id, landfeature).toPromise();
  }

  async getAll(query: string): Promise<Array<Landfeature>> {
    const items = await this.http.get<Array<Landfeature>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Landfeature>> {
    const items = await this.http.get<Array<Landfeature>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(landfeature: Landfeature): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, landfeature).toPromise();
  }

}
