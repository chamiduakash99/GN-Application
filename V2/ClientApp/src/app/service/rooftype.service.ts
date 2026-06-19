import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rooftype } from '../entity/rooftype';
import {Floortype} from "../entity/floortype";

@Injectable({
  providedIn: 'root'
})
export class RooftypeService {

  private baseUrl = 'http://localhost:8080/rooftypes';

  constructor(private http: HttpClient) { }

  // Get all roof types
  async getAll(query: string = ''): Promise<Array<Rooftype>> {
    const rooftypes = await this.http.get<Array<Rooftype>>(this.baseUrl + query).toPromise();
    return rooftypes ?? [];
  }

  // Add new roof type
  async add(rooftype: Rooftype): Promise<Rooftype | undefined> {
    return this.http.post<Rooftype>(this.baseUrl, rooftype).toPromise();
  }

  // Update roof type
  async update(rooftype: Rooftype): Promise<Rooftype | undefined> {
    return this.http.put<Rooftype>(this.baseUrl, rooftype).toPromise();
  }

  // Delete roof type
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get by ID
  async getById(id: number): Promise<Rooftype | undefined> {
    return this.http.get<Rooftype>(`${this.baseUrl}/${id}`).toPromise();
  }

  async getAllListNameId(): Promise<Array<Rooftype>> {
    const rooftypes = await this.http.get<Array<Rooftype>>(this.baseUrl + '/list').toPromise();
    if (rooftypes == undefined) {
      return [];
    }
    return rooftypes;
  }

}
