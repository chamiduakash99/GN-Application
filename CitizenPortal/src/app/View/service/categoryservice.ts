import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../entity/emptype";
import {Usrtype} from "../entity/usrtype";
import {Category} from "../entity/category";

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Category>> {

    const category = await this.http.get<Array<Category>>('http://localhost:8080/categories').toPromise();
    if(category == undefined){
      return [];
    }
    return category;
  }

}


