import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

const host = environment.host;

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }

  public getBudgetById(budgetId: any) {
    return this.http.get(host + '/budget/' + budgetId).toPromise()
  }

  public getAllBudgets() {
    return this.http.get(host + '/budget').toPromise()
  }

  public addBudget(budget:any){
    return this.http.post(host + '/budget',budget).toPromise();
  }
  public updateBudget(budgetId:any,budget:any){
    return this.http.put(host + '/budget/' + budgetId,budget).toPromise();
  }
   

}
