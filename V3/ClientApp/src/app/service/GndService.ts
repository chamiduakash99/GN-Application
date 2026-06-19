import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Gnd } from "../entity/gnd";

@Injectable({
  providedIn: 'root'
})
export class GndService {

  private baseUrl = 'http://localhost:8080/gnd';

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Array<Gnd>> {
    const list = await this.http.get<Array<Gnd>>(this.baseUrl + '/list').toPromise();
    if (list == undefined) {
      return [];
    }
    return list;
  }

  async getById(id: number): Promise<Gnd | undefined> {
    return this.http.get<Gnd>(`${this.baseUrl}/${id}`).toPromise();
  }

}
