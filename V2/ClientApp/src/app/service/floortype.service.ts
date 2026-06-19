import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Floortype } from '../entity/floortype';
import {Street} from "../entity/Street";

@Injectable({
  providedIn: 'root'
})
export class FloortypeService {

  private baseUrl = 'http://localhost:8080/floortype';

  constructor(private http: HttpClient) { }

  // Get all floor types
  async getAll(query: string = ''): Promise<Array<Floortype>> {
    const floortypes = await this.http.get<Array<Floortype>>(this.baseUrl + query).toPromise();
    return floortypes ?? [];
  }

  // Add new floor type
  async add(floortype: Floortype): Promise<Floortype | undefined> {
    return this.http.post<Floortype>(this.baseUrl, floortype).toPromise();
  }

  // Update floor type
  async update(floortype: Floortype): Promise<Floortype | undefined> {
    return this.http.put<Floortype>(this.baseUrl, floortype).toPromise();
  }

  // Delete floor type
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get by ID
  async getById(id: number): Promise<Floortype | undefined> {
    return this.http.get<Floortype>(`${this.baseUrl}/${id}`).toPromise();
  }

  async getAllListNameId(): Promise<Array<Floortype>> {
    const floortypes = await this.http.get<Array<Floortype>>(this.baseUrl + '/list').toPromise();
    if (floortypes == undefined) {
      return [];
    }
    return floortypes;
  }

}
