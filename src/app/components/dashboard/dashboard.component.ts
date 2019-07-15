import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditExpenseDialogComponent } from 'src/app/dialogs/edit-expense-dialog/edit-expense-dialog.component';
import { AddExpenseDialogComponent } from 'src/app/dialogs/add-expense-dialog/add-expense-dialog.component';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, MultiDataSet } from 'ng2-charts';
import * as _ from 'lodash';
import { BudgetService } from 'src/app/services/budget.service';
import { DeleteExpenseDailogComponent } from 'src/app/dialogs/delete-expense-dailog/delete-expense-dailog.component';
import { UndoDeleteExpenseDialogComponent } from 'src/app/dialogs/undo-delete-expense-dialog/undo-delete-expense-dialog.component';
import { Expense } from 'src/app/models/expense';
import { category } from 'src/app/models/category';
import { Budget } from 'src/app/models/budget';
class ChartConfig {
  public pieChartLabels: Label[];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType;
  public pieChartLegend: boolean;
  public pieChartPlugins: any[];
  public pieChartColors: any[]
}

class DaugnatChartConfig {
  // Doughnut
  public doughnutChartLabels: Label[];
  public doughnutChartData: MultiDataSet[];
  public doughnutChartType: ChartType;
  public doughnutChartColors: any[]

}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private expenses: Expense[] = []
  public chartConfig = new ChartConfig();
  public daugnatChartConfig = new DaugnatChartConfig();
  public totalBudget: Budget = new Budget;
  public totalExpense: number = 0;

  constructor(private expenseSrv: ExpenseService,
    public dialog: MatDialog,
    private budgetSrv: BudgetService) {
    this.initPieChart();
    this.initDaugnatChart();
  }

  public initDaugnatChart() {
    this.daugnatChartConfig.doughnutChartLabels = ['Total budget', 'Total expense'];
    this.daugnatChartConfig.doughnutChartData = [];
    this.daugnatChartConfig.doughnutChartType = 'doughnut';
    this.daugnatChartConfig.doughnutChartColors = [
      {
        backgroundColor: ['#81C784', '#FF8A65'],
      },
    ];
  }

  public initPieChart() {
    this.chartConfig.pieChartLabels = [];
    this.chartConfig.pieChartData = [];
    this.chartConfig.pieChartType = 'pie';
    this.chartConfig.pieChartLegend = true;
    this.chartConfig.pieChartPlugins = [];
    this.chartConfig.pieChartColors = [
      {
        backgroundColor: ['#81C784', '#FF8A65', '#64B5F6', '#FFD54F', '#9575CD'],
      },
    ];
  }
  // Pie
  public pieChartOptions: ChartOptions = {
    legend: { display: true, position: 'right' }
  }


  ngOnInit() {
    //Load all the expenses
    this.loadAllExpense();
    //Load total Budget
    this.loadAllBudgets();
    //Load all the chart data
    this.loadChartData();
  }

  /*
  * To load all the expense data
  */
  public loadAllExpense() {
    this.expenseSrv
      .getAllExpenses()
      .then((res: any) => {
        if (res.data) {
          this.expenses = res.data;
        }
      });
  }

  /*
  * To load Total budget from api
  */
  public loadAllBudgets() {
    this.budgetSrv
      .getAllBudgets()
      .then((res: any) => {
        console.log(res);
        const data = res.data;
        if (data.length > 0) {
          this.totalBudget = data[0];
        }
      })
  }

  /*
  * To load chart data from api
  */
  public loadChartData() {
    this.expenseSrv
      .getAllExpenseChartData()
      .then((res: any) => {
        if (res.data &&  res.data.length>0) {
          this.prepareChartData(res.data);
        }
      });
  }

  /*
 * To prepare chart data,in required format
 */
  public prepareChartData(expense) {

    var result: any = _.chain(expense)
      .groupBy("category.name")
      .toPairs()
      .map(function (currentItem: any) {
        return _.zipObject(["category", "data"], currentItem);
      })
      .value();


    var final: any = {
      labels: [],
      amounts: []
    }

    result.forEach((e: any) => {
      final.labels.push(e.category);
      let amt = 0;
      e.data.forEach(element => {
        amt = amt + element.amount;
      });
      final.amounts.push(amt);
    });

    this.chartConfig.pieChartLabels = final.labels;
    this.chartConfig.pieChartData = final.amounts;
    this.chartConfig.pieChartType = 'pie';
    this.chartConfig.pieChartLegend = true;
    this.chartConfig.pieChartPlugins = [];

    const totalExpense = final.amounts.reduce((total, num) => {
      return total + num;
    })

    this.totalExpense = totalExpense


    const percentage = (this.totalExpense / this.totalBudget.amount) * 100;
    const daugnatData: any = [100 - percentage, percentage]

    this.daugnatChartConfig.doughnutChartLabels = ['Remaining budget', 'Total expense'];
    this.daugnatChartConfig.doughnutChartData = [daugnatData];

  }

  /*
  *Method to add new expense in the server
  */
  public addExpense(expense: any) {
    this.expenseSrv
      .addExpense(expense)
      .then((res: any) => {
        console.log(res);
        this.loadAllExpense();
      })
  }

  /*
  * Method to open up a material dialog for edit expense.
  */

  public openEditExpenseModal(expense): void {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '600px',
      data: expense
    });

    dialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        this.expenseSrv
          .updateExpense(result._id, result)
          .then((res: any) => {
            console.log(res);

            console.log("Updated successfully");
            this.loadAllExpense();
            this.loadAllBudgets();
            this.loadChartData();

          })

      }

    });
  }

  /*
  * Method to open up a material dialog for add expense.
  */
  openAddExpenseModal(): void {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        console.log(result);
        this.expenseSrv
          .addExpense(result)
          .then((res: any) => {
            console.log(res);
            this.loadAllExpense();
            this.loadAllBudgets();
            this.loadChartData();
          });
      }

    });
  }

  /*
  * Method to open up a material dialog for delete expense.
  */
  openDeleteExpenseModal(expense): void {
    const dialogRef = this.dialog.open(DeleteExpenseDailogComponent, {
      width: '450px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        console.log(result);
        expense.deleted = true;
        this.expenseSrv
          .updateExpense(expense._id, expense)
          .then((res: any) => {
            //after update loading all fresh data
            this.loadAllExpense();
            this.loadAllBudgets();
            this.loadChartData();
          });
      }

    });
  }

  /*
* Method to open up a material dialog for undo delete expense.
*/
  openUndoDeleteExpenseModal(expense): void {
    const dialogRef = this.dialog.open(UndoDeleteExpenseDialogComponent, {
      width: '450px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);

      if (result) {
        console.log(result);
        if (expense.deleted) {
          expense.deleted = false;
        }
        this.expenseSrv
          .updateExpense(expense._id, expense)
          .then((res: any) => {
            //after update loading all fresh data
            this.loadAllExpense();
            this.loadAllBudgets();
            this.loadChartData();
          });
      }

    });
  }
}
