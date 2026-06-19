import {Announcement} from "../entity/Announcement";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class AnnouncementService {

  readonly url = 'http://localhost:8080/announcements';
  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/announcements/' + id).toPromise();
  }

  async update(announcement: Announcement): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/announcements', announcement).toPromise();
  }

  async getAll(query:string): Promise<Array<Announcement>> {
    const announcements = await this.http.get<Array<Announcement>>('http://localhost:8080/announcements'+query).toPromise();
    if(announcements == undefined){
      return [];
    }
    return announcements;
  }

  async add(announcement: Announcement): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/announcements', announcement).toPromise();
  }

  getAllList(): Promise<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.url}/list`).toPromise() as Promise<Announcement[]>;
  }
}
