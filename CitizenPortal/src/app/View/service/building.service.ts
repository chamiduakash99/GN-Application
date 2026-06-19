import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Building } from '../entity/Building';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  private baseUrl = 'http://localhost:8080/buildings';

  constructor(private http: HttpClient) { }

  // Get all buildings
  async getAll(query: string = ''): Promise<Array<Building>> {
    const buildings = await this.http.get<Array<Building>>(this.baseUrl + query).toPromise();
    return buildings ?? [];
  }

  // Add new building
  async add(building: Building): Promise<Building | undefined> {
    return this.http.post<Building>(this.baseUrl, building).toPromise();
  }

  // Update building
  async update(building: Building): Promise<Building | undefined> {
    return this.http.put<Building>(this.baseUrl, building).toPromise();
  }

  // Delete building
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get by ID
  async getById(id: number): Promise<Building | undefined> {
    return this.http.get<Building>(`${this.baseUrl}/${id}`).toPromise();
  }
}
