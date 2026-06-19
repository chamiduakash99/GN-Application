import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Citizen } from '../entity/Citizen';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {

  private baseUrl = 'http://localhost:8080/citizens';

  constructor(private http: HttpClient) { }

  // Get all citizens (with optional query filters)
  async getAll(query: string = ''): Promise<Array<Citizen>> {
    const citizens = await this.http.get<Array<Citizen>>(this.baseUrl + query).toPromise();
    return citizens ?? [];
  }

  // Get citizen by ID
  async getById(id: number): Promise<Citizen | undefined> {
    return this.http.get<Citizen>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Add new citizen
  async add(citizen: Citizen): Promise<Citizen | undefined> {
    return this.http.post<Citizen>(this.baseUrl, citizen).toPromise();
  }

  // Update citizen
  async update(citizen: Citizen): Promise<Citizen | undefined> {
    return this.http.put<Citizen>(this.baseUrl, citizen).toPromise();
  }

  // Delete citizen
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  async getAllListNameId(): Promise<Array<Citizen>> {

    const citizens = await this.http
      .get<Array<Citizen>>(this.baseUrl + '/list')
      .toPromise();

    if (citizens == undefined) {
      return [];
    }

    return citizens;
  }

}
