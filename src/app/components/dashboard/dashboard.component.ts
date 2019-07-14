import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditExpenseDialogComponent } from 'src/app/dialogs/edit-expense-dialog/edit-expense-dialog.component';
import { AddExpenseDialogComponent } from 'src/app/dialogs/add-expense-dialog/add-expense-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private expenses: any = []
  private categories: any = [];
  private selectedExpense: any = {};
  constructor(private expenseSrv: ExpenseService,
    private categorySrv: CategoryService, public dialog: MatDialog) { }

  @ViewChild('closeModal') closeModal: ElementRef;

  @ViewChild('editExpenseModal') editExpenseModal: ElementRef;
  @ViewChild('closeExpenseModal') closeExpenseModal: ElementRef;

  ngOnInit() {

    this.loadAllExpense();
    this.loadAllCategories();
  }

  public loadAllExpense() {
    this.expenseSrv
      .getAllExpenses()
      .then((res: any) => {

        if (res.data) {
          this.expenses = res.data;
        }
      });

  }

  addExpense(expense: any) {
    this.expenseSrv
      .addExpense(expense)
      .then((res: any) => {
        console.log(res);
        this.closeModal.nativeElement.click();
        this.loadAllExpense();

      })
  }

  onClickSubmit(data) {
    data.date = new Date(data.date);
    console.log(data);
    this.addExpense(data)
  }

  loadAllCategories() {
    this.categorySrv
      .getAllCategories()
      .then((res: any) => {
        console.log(res);
        const data = res.data;
        this.categories = data;
      })
      .catch(e => {
        console.error("Error occured while loading categories")
      })
  }

  editExpense(expense: any) {
    this.openEditExpenseModal(expense);
  }

  openEditExpenseModal(expense): void {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '600px',
      data: expense
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if(result){
        console.log(result);
        this.expenseSrv
          .updateExpense(result._id, result)
          .then((res: any) => {
            console.log("Updated successfully");
            this.loadAllExpense();
  
          })
  
      }
    
    });
  }

  openAddExpenseModal(): void {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if(result){
        console.log(result);
        this.expenseSrv
          .addExpense(result)
          .then((res: any) => {
            console.log("Added successfully");
            this.loadAllExpense();
  
          });
      }
    
    });
  }
}
