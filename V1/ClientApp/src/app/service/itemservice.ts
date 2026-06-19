import {Item} from "../entity/item";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class ItemService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/items/' + id).toPromise();
  }

  async update(item: Item): Promise<[]|undefined>{
    //console.log("Item Updating-"+item.id);
    return this.http.put<[]>('http://localhost:8080/items', item).toPromise();
  }


  async getAll(query:string): Promise<Array<Item>> {
    const items = await this.http.get<Array<Item>>('http://localhost:8080/items'+query).toPromise();
    if(items == undefined){
      return [];
    }
    return items;
  }

  // async getAllListNameId(): Promise<Array<Item>> {
  //
  //   const items = await this.http.get<Array<Item>>('http://localhost:8080/items/list').toPromise();
  //   if(items == undefined){
  //     return [];
  //   }
  //   return items;
  // }

  async add(item: Item): Promise<[]|undefined>{
    //console.log("Item Adding-"+JSON.stringify(item));
    //item.number="47457";
    return this.http.post<[]>('http://localhost:8080/items', item).toPromise();
  }

}


