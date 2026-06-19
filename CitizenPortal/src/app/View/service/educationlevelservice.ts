import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Educationlevel } from "../entity/educationlevel";

@Injectable({
  providedIn: 'root'
})
export class EducationlevelService {

  private baseUrl = 'http://localhost:8080/educationlevel';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(educationlevel: Educationlevel): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl + '/' + educationlevel.id, educationlevel).toPromise();
  }

  async getAll(query: string): Promise<Array<Educationlevel>> {
    const items = await this.http.get<Array<Educationlevel>>(this.baseUrl + query).toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async getAllListNameId(): Promise<Array<Educationlevel>> {
    const items = await this.http.get<Array<Educationlevel>>(this.baseUrl + '/list').toPromise();
    if (items == undefined) {
      return [];
    }
    return items;
  }

  async add(educationlevel: Educationlevel): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, educationlevel).toPromise();
  }
}
