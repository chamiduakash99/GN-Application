import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Matiralstatus } from "../entity/matiralstatus";

@Injectable({
  providedIn: 'root'
})
export class MatiralstatusService {

  private baseUrl = 'http://localhost:8080/matiralstatus';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(matiralstatus: Matiralstatus): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + matiralstatus.id, matiralstatus).toPromise();
  }

  async getAll(query: string): Promise<Array<Matiralstatus>> {
    const items = await this.http.get<Array<Matiralstatus>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Matiralstatus>> {
    const items = await this.http.get<Array<Matiralstatus>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(matiralstatus: Matiralstatus): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, matiralstatus).toPromise();
  }
}
