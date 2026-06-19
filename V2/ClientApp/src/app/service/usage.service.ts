import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usage } from '../entity/usage';
import {Street} from "../entity/Street";

@Injectable({
  providedIn: 'root'
})
export class UsageService {

  private baseUrl = 'http://localhost:8080/usage';

  constructor(private http: HttpClient) { }

  // Get all usages
  async getAll(query: string = ''): Promise<Array<Usage>> {
    const usages = await this.http.get<Array<Usage>>(this.baseUrl + query).toPromise();
    if (usages == undefined){
     return [];
    }
    return usages;
  }

  // Add new usage
  async add(usage: Usage): Promise<Usage | undefined> {
    return this.http.post<Usage>(this.baseUrl, usage).toPromise();
  }

  // Update usage
  async update(usage: Usage): Promise<Usage | undefined> {
    return this.http.put<Usage>(this.baseUrl, usage).toPromise();
  }

  // Delete usage
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get by ID
  async getById(id: number): Promise<Usage | undefined> {
    return this.http.get<Usage>(`${this.baseUrl}/${id}`).toPromise();
  }

  async getAllListNameId(): Promise<Array<Usage>> {
    const usages = await this.http.get<Array<Usage>>(this.baseUrl + '/list').toPromise();
    if (usages == undefined) {
      return [];
    }
    return usages;
  }
}
