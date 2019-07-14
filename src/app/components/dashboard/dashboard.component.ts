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

  private expenses: any = []
  private categories: any = [];
  private selectedExpense: any = {};
  public chartConfig = new ChartConfig();
  public daugnatChartConfig = new DaugnatChartConfig();
  public totalBudget: any = 0;
  public totalExpense: any = 0;
  public totalList = [];

  constructor(private expenseSrv: ExpenseService,
    private categorySrv: CategoryService, public dialog: MatDialog,
    private budgetSrv: BudgetService) {
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

    this.daugnatChartConfig.doughnutChartLabels = ['Total budget', 'Total expense'];
    this.daugnatChartConfig.doughnutChartData = [];
    this.daugnatChartConfig.doughnutChartType = 'doughnut';
    this.daugnatChartConfig.doughnutChartColors = [
      {
        backgroundColor: ['#81C784', '#FF8A65'],
      },
    ];
  }

  // Pie
  public pieChartOptions: ChartOptions = {
    legend: { display: true, position: 'right' }
  }


  ngOnInit() {

    this.loadAllExpense();
    this.loadAllCategories();
    this.loadAllBudgets();
    this.loadAllExpenseChartData();
  }

  public loadAllExpense() {
    this.expenseSrv
      .getAllExpenses()
      .then((res: any) => {
        console.log(res);

        if (res.data) {
          this.expenses = res.data;
        }
        for (let i = 1; i <= res.data.count; i++) {
          this.totalList.push(1);
        }

      });

  }

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
  public loadAllExpenseChartData() {
    this.expenseSrv
      .getAllExpenseChartData()
      .then((res: any) => {
        if (res.data) {
          this.prepareChartData(res.data);
        }
      });
  }

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


    const percentage = (totalExpense / this.totalBudget.amount) * 100;
    const daugnatData: any = [100 - percentage, percentage]

    this.daugnatChartConfig.doughnutChartLabels = ['Remaining budget', 'Total expense'];
    this.daugnatChartConfig.doughnutChartData = [daugnatData];

    console.log(this.daugnatChartConfig)
  }

  addExpense(expense: any) {
    this.expenseSrv
      .addExpense(expense)
      .then((res: any) => {
        console.log(res);
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

      if (result) {
        this.expenseSrv
          .updateExpense(result._id, result)
          .then((res: any) => {
            console.log(res);

            console.log("Updated successfully");
            this.loadAllExpense();
            this.loadAllBudgets();
            this.loadAllExpenseChartData();

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

      if (result) {
        console.log(result);
        this.expenseSrv
          .addExpense(result)
          .then((res: any) => {
            console.log(res);
            this.loadAllExpense();
            this.loadAllBudgets();
            this.loadAllExpenseChartData();
          });
      }

    });
  }

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
            .updateExpense(expense._id,expense)
            .then((res: any) => {
              console.log(res);
              this.loadAllExpense();
              this.loadAllBudgets();
              this.loadAllExpenseChartData();
            });
        }
  
      });
  }
}
