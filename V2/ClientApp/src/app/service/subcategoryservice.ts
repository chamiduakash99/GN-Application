import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../entity/emptype";
import {Usrtype} from "../entity/usrtype";
import {Subcategory} from "../entity/subcategory";

@Injectable({
  providedIn: 'root'
})

export class SubcategoryService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Subcategory>> {

    const subcategories = await this.http.get<Array<Subcategory>>('http://localhost:8080/subcategories').toPromise();
    if(subcategories == undefined){
      return [];
    }
    return subcategories;
  }

}


