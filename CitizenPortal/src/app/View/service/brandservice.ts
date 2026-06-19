import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Brand} from "../entity/brand";

@Injectable({
  providedIn: 'root'
})

export class BrandService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Brand>> {

    const brands = await this.http.get<Array<Brand>>('http://localhost:8080/brands').toPromise();
    if(brands == undefined){
      return [];
    }
    return brands;
  }

}


