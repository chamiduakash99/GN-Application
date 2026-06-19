import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Land } from '../entity/Land';

@Injectable({
  providedIn: 'root'
})
export class LandService {

  private baseUrl = 'http://localhost:8080/lands';

  constructor(private http: HttpClient) { }

  // Get all lands with optional query string
  async getAll(query: string = ''): Promise<Array<Land>> {
    const lands = await this.http.get<Array<Land>>(this.baseUrl + query).toPromise();
    return lands ?? [];
  }

  // Add a new land
  async add(land: Land): Promise<Land | undefined> {
    return this.http.post<Land>(this.baseUrl, land).toPromise();
  }

  // Update an existing land
  async update(land: Land): Promise<Land | undefined> {
    return this.http.put<Land>(this.baseUrl, land).toPromise();
  }

  // Delete a land by id
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Optionally, get a land by ID
  async getById(id: number): Promise<Land | undefined> {
    return this.http.get<Land>(`${this.baseUrl}/${id}`).toPromise();
  }
}
