import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Aidprogram } from "../entity/aidprogram";

@Injectable({
  providedIn: 'root'
})
export class AidprogramService {

  private baseUrl = 'http://localhost:8080/aidprogram';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(aidprogram: Aidprogram): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + aidprogram.id, aidprogram).toPromise();
  }

  async getAll(query: string): Promise<Array<Aidprogram>> {
    const items = await this.http.get<Array<Aidprogram>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Aidprogram>> {
    const items = await this.http.get<Array<Aidprogram>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(aidprogram: Aidprogram): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, aidprogram).toPromise();
  }
}
