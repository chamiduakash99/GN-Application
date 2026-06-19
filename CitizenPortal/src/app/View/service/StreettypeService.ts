import { Streettype } from "../entity/Streettype";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StreettypeService {

  private baseUrl = 'http://localhost:8080/streettype';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(streettype: Streettype): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl, streettype).toPromise();
  }

  async getAll(query: string): Promise<Array<Streettype>> {
    const streettypes = await this.http.get<Array<Streettype>>(this.baseUrl + query).toPromise();
    if (streettypes == undefined) {
      return [];
    }
    return streettypes;
  }

  async getAllListNameId(): Promise<Array<Streettype>> {
    const streettypes = await this.http.get<Array<Streettype>>(this.baseUrl + '/list').toPromise();
    if (streettypes == undefined) {
      return [];
    }
    return streettypes;
  }

  async add(streettype: Streettype): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, streettype).toPromise();
  }

}
