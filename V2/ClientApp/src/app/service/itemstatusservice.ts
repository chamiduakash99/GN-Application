import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../entity/emptype";
import {Usrtype} from "../entity/usrtype";
import {ItemStatus} from "../entity/itemstatus";

@Injectable({
  providedIn: 'root'
})

export class ItemstatusService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<ItemStatus>> {

    const itemstatus = await this.http.get<Array<ItemStatus>>('http://localhost:8080/itemstatuses/list').toPromise();
    if(itemstatus == undefined){
      return [];
    }
    return itemstatus;
  }

}


