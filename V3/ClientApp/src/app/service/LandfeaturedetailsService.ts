import { Landfeaturedetails } from "../entity/Landfeaturedetails";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LandfeaturedetailsService {

  private baseUrl = 'http://localhost:8080/landfeaturedetails';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(details: Landfeaturedetails): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl, details).toPromise();
  }

  async getAll(query: string): Promise<Array<Landfeaturedetails>> {
    const items = await this.http.get<Array<Landfeaturedetails>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Landfeaturedetails>> {
    const items = await this.http.get<Array<Landfeaturedetails>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(details: Landfeaturedetails): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, details).toPromise();
  }

}
