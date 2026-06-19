import { Landtype } from "../entity/Landtype";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LandtypeService {

  private baseUrl = 'http://localhost:8080/landtype';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(landtype: Landtype): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + landtype.id, landtype).toPromise();
  }

  async getAll(query: string): Promise<Array<Landtype>> {
    const types = await this.http.get<Array<Landtype>>(this.baseUrl + query).toPromise();
    if (types == undefined) {
      return [];
    }
    return types;
  }

  async getAllListNameId(): Promise<Array<Landtype>> {
    const types = await this.http.get<Array<Landtype>>(this.baseUrl + '/list').toPromise();
    if (types == undefined) {
      return [];
    }
    return types;
  }

  async add(landtype: Landtype): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, landtype).toPromise();
  }

}
