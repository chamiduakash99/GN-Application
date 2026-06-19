import { Street } from "../entity/Street";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StreetService {

  private baseUrl = 'http://localhost:8080/streets';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(street: Street): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl, street).toPromise();
  }

  async getAll(query: string): Promise<Array<Street>> {
    const streets = await this.http.get<Array<Street>>(this.baseUrl + query).toPromise();
    if (streets == undefined) {
      return [];
    }
    return streets;
  }

  async getAllListNameId(): Promise<Array<Street>> {
    const streets = await this.http.get<Array<Street>>(this.baseUrl + '/list').toPromise();
    if (streets == undefined) {
      return [];
    }
    return streets;
  }

  async add(street: Street): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, street).toPromise();
  }

}
