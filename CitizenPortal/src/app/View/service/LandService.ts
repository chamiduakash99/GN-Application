import { Land } from "../entity/Land";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LandService {

  private baseUrl = 'http://localhost:8080/landdetails';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(land: Land): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl, land).toPromise();
  }

  async getAll(query: string): Promise<Array<Land>> {
    const lands = await this.http.get<Array<Land>>(this.baseUrl + query).toPromise();
    if (lands == undefined) {
      return [];
    }
    return lands;
  }

  async getAllListNameId(): Promise<Array<Land>> {
    // if your backend exposes a list endpoint for quick name/id use it, otherwise reuse getAll('')
    const lands = await this.http.get<Array<Land>>(this.baseUrl + '/list').toPromise();
    if (lands == undefined) {
      return [];
    }
    return lands;
  }

  async add(land: Land): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, land).toPromise();
  }

}
