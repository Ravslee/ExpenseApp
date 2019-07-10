import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const host = environment.host;


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }
  
  public getCategoryById(categoryId: any) {
    return this.http.get(host + '/category/' + categoryId).toPromise()
  }

  public getAllCategories() {
    return this.http.get(host + '/category').toPromise()
  }

  public addCategory(category: any) {
    return this.http.post(host + '/category', category).toPromise();
  }

  public updateCategory(categoryId: any, category: any) {
    return this.http.put(host + '/category/' + categoryId, category).toPromise();
  }

  public deleteCategory(categoryId: any) {
    return this.http.delete(host + '/category/' + categoryId).toPromise();
  }

}
