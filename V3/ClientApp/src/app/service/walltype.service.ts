import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Walltype } from '../entity/walltype';

@Injectable({
  providedIn: 'root'
})
export class WalltypeService {

  private baseUrl = 'http://localhost:8080/walltype';

  constructor(private http: HttpClient) { }

  // Get all wall types
  async getAll(query: string = ''): Promise<Array<Walltype>> {
    const walltypes = await this.http.get<Array<Walltype>>(this.baseUrl + '/list' + query).toPromise();
    return walltypes ?? [];
  }
  // async getAll(query: string = ''): Promise<Array<Walltype>> {
  //   const walltypes = await this.http.get<Array<Walltype>>(this.baseUrl + query).toPromise();
  //   return walltypes ?? [];
  // }

  // Add new wall type
  async add(walltype: Walltype): Promise<Walltype | undefined> {
    return this.http.post<Walltype>(this.baseUrl, walltype).toPromise();
  }

  // Update wall type
  async update(walltype: Walltype): Promise<Walltype | undefined> {
    return this.http.put<Walltype>(this.baseUrl, walltype).toPromise();
  }

  // Delete wall type
  async delete(id: number): Promise<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get by ID
  async getById(id: number): Promise<Walltype | undefined> {
    return this.http.get<Walltype>(`${this.baseUrl}/${id}`).toPromise();
  }

  // Get all wall types
  async getAllListNameId(): Promise<Array<Walltype>> {
    return this.getAll('');
  }
}
