import { Streetstatus } from "../entity/Streetstatus";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StreetstatusService {

  private baseUrl = 'http://localhost:8080/streetstatus';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(streetstatus: Streetstatus): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl, streetstatus).toPromise();
  }

  async getAll(query: string): Promise<Array<Streetstatus>> {
    const statuses = await this.http.get<Array<Streetstatus>>(this.baseUrl + query).toPromise();
    if (statuses == undefined) {
      return [];
    }
    return statuses;
  }

  async getAllListNameId(): Promise<Array<Streetstatus>> {
    const statuses = await this.http.get<Array<Streetstatus>>(this.baseUrl + '/list').toPromise();
    if (statuses == undefined) {
      return [];
    }
    return statuses;
  }

  async add(streetstatus: Streetstatus): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, streetstatus).toPromise();
  }

}
