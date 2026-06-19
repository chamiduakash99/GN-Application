import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Religion } from "../entity/religion";

@Injectable({
  providedIn: 'root'
})
export class ReligionService {

  private baseUrl = 'http://localhost:8080/religion';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(religion: Religion): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + religion.id, religion).toPromise();
  }

  async getAll(query: string): Promise<Array<Religion>> {
    const items = await this.http.get<Array<Religion>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Religion>> {
    const items = await this.http.get<Array<Religion>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(religion: Religion): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, religion).toPromise();
  }
}
