import { Streetmatierial } from "../entity/Streetmatierial";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StreetmatierialService {

  private baseUrl = 'http://localhost:8080/streetmatierial';

  constructor(private http: HttpClient) { }

  async delete(id: number): Promise<[] | undefined> {
    // @ts-ignore
    return this.http.delete(this.baseUrl + '/' + id).toPromise();
  }

  async update(streetmatierial: Streetmatierial): Promise<[] | undefined> {
    return this.http.put<[]>(this.baseUrl, streetmatierial).toPromise();
  }

  async getAll(query: string): Promise<Array<Streetmatierial>> {
    const streetmatierials = await this.http.get<Array<Streetmatierial>>(this.baseUrl + query).toPromise();
    if (streetmatierials == undefined) {
      return [];
    }
    return streetmatierials;
  }

  async getAllListNameId(): Promise<Array<Streetmatierial>> {
    const streetmatierials = await this.http.get<Array<Streetmatierial>>(this.baseUrl + '/list').toPromise();
    if (streetmatierials == undefined) {
      return [];
    }
    return streetmatierials;
  }

  async add(streetmatierial: Streetmatierial): Promise<[] | undefined> {
    return this.http.post<[]>(this.baseUrl, streetmatierial).toPromise();
  }

}
