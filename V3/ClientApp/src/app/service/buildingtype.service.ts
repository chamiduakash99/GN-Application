import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Buildingtype } from '../entity/buildingtype';

@Injectable({
  providedIn: 'root'
})
export class BuildingtypeService {

  private baseUrl = 'http://localhost:8080/buildingtype';

  constructor(private http: HttpClient) { }

  // Get all building types
  async getAll(query: string = ''): Promise<Array<Buildingtype>> {
    const buildingtypes = await this.http.get<Array<Buildingtype>>(this.baseUrl + '/list' + query).toPromise();
    return buildingtypes ?? [];
  }
  // async getAll(query: string = ''): Promise<Array<Buildingtype>> {
  //   const buildingtypes = await this.http.get<Array<Buildingtype>>(this.baseUrl + query).toPromise();
  //   return buildingtypes ?? [];
  // }

  // Add new building type
  async add(buildingtype: Buildingtype): Promise<Buildingtype | undefined> {
    return this.http.post<Buildingtype>(this.baseUrl, buildingtype).toPromise();
  }

  // Update building type
  async update(buildingtype: Buildingtype): Promise<Buildingtype | undefined> {
    return this.http.put<Buildingtype>(this.baseUrl, buildingtype).toPromise();
  }

  // Delete building type
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get by ID
  async getById(id: number): Promise<Buildingtype | undefined> {
    return this.http.get<Buildingtype>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get all building types
  async getAllListNameId(): Promise<Array<Buildingtype>> {
    return this.getAll('');
  }
}
