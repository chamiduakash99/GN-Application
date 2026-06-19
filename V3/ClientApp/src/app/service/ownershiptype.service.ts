import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OwnershipType } from '../entity/ownershiptype';
import {Street} from "../entity/Street";

@Injectable({
  providedIn: 'root'
})
export class OwnershipTypeService {

  private baseUrl = 'http://localhost:8080/ownershiptype';

  constructor(private http: HttpClient) { }

  // Get all ownership types
  async getAll(query: string = ''): Promise<Array<OwnershipType>> {
    const types = await this.http.get<Array<OwnershipType>>(this.baseUrl + query).toPromise();
    return types ?? [];
  }

  // Add new ownership type
  async add(type: OwnershipType): Promise<OwnershipType | undefined> {
    return this.http.post<OwnershipType>(this.baseUrl, type).toPromise();
  }

  // Update ownership type
  async update(type: OwnershipType): Promise<OwnershipType | undefined> {
    return this.http.put<OwnershipType>(this.baseUrl, type).toPromise();
  }

  // Delete ownership type
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get ownership type by ID
  async getById(id: number): Promise<OwnershipType | undefined> {
    return this.http.get<OwnershipType>(`${this.baseUrl}/${id}`).toPromise();
  }

  async getAllListNameId(): Promise<Array<OwnershipType>> {
    const ownershiptypes = await this.http.get<Array<OwnershipType>>(this.baseUrl + '/list').toPromise();
    if (ownershiptypes == undefined) {
      return [];
    }
    return ownershiptypes;
  }

}
