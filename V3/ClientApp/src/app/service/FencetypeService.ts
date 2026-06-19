import { Fencetype } from "../entity/Fencetype";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FencetypeService {

  private baseUrl = 'http://localhost:8080/fencetype';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(fencetype: Fencetype): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + fencetype.id, fencetype).toPromise();
  }

  async getAll(query: string): Promise<Array<Fencetype>> {
    const items = await this.http.get<Array<Fencetype>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Fencetype>> {
    const items = await this.http.get<Array<Fencetype>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(fencetype: Fencetype): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, fencetype).toPromise();
  }

}
