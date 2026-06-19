import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Division } from "../entity/division";

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  private baseUrl = 'http://localhost:8080/division';

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Division>> {
    const list = await this.http.get<Array<Division>>(this.baseUrl + '/list').toPromise();
    if (list == undefined) {
      return [];
    }
    return list;
  }

  async getById(id: number): Promise<Division | undefined> {
    return this.http.get<Division>(`${this.baseUrl}/${id}`).toPromise();
  }

}
