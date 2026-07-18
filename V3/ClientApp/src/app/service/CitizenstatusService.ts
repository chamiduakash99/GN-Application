import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Citizenstatus } from "../entity/citizenstatus";

@Injectable({
  providedIn: 'root'
})
export class CitizenstatusService {

  private baseUrl = 'http://localhost:8080/citizenstatuses';

  constructor(private http: HttpClient) { }

  async getAllListNameId(): Promise<Array<Citizenstatus>> {
    const items = await this.http.get<Array<Citizenstatus>>(this.baseUrl + '/list').toPromise();

    if (items == undefined) {
      return [];
    }

    return items;
  }
}
