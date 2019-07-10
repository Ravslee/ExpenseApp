import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const host = environment.host;

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http:HttpClient) { }

  public getExpenseById(expenseId: any) {
    return this.http.get(host + '/expense/' + expenseId).toPromise()
  }

  public getAllExpenses() {
    return this.http.get(host + '/expense').toPromise()
  }

  public addExpense(expense: any) {
    return this.http.post(host + '/expense', expense).toPromise();
  }

  public updateExpense(expenseId: any, expense: any) {
    return this.http.put(host + '/expense/' + expenseId, expense).toPromise();
  }

  public deleteExpense(expenseId: any) {
    return this.http.delete(host + '/expense/' + expenseId).toPromise();
  }

}
