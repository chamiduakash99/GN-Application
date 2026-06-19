import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Relationshiptype } from "../entity/relationshiptype";

@Injectable({
  providedIn: 'root'
})
export class RelationshiptypeService {

  private baseUrl = 'http://localhost:8080/relationshiptype';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(relationshiptype: Relationshiptype): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + relationshiptype.id, relationshiptype).toPromise();
  }

  async getAll(query: string): Promise<Array<Relationshiptype>> {
    const items = await this.http.get<Array<Relationshiptype>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Relationshiptype>> {
    const items = await this.http.get<Array<Relationshiptype>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(relationshiptype: Relationshiptype): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, relationshiptype).toPromise();
  }
}
