import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service'
import { BudgetService } from '../../services/budget.service'
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public categories: any = [];
  public totalBudget: any = {};
  public catName: any;
  constructor(private categorySrv: CategoryService,
    private budgetSrv: BudgetService) { }

  ngOnInit() {
    this.loadAllCategories();
    this.loadAllBudgets();
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
  public onUpdateTotalBudget() {
    if (!this.totalBudget.amount) {
      alert("Please enter value for Total budget");
    }
    if (this.totalBudget && this.totalBudget._id) {
      this.updateBudget(this.totalBudget.amount, this.totalBudget._id);
    } else {
      this.addBudget(this.totalBudget.amount)
    }

  }

  updateBudget(val, id) {
    const budget = { amount: +val }
    this.budgetSrv
      .updateBudget(id, budget)
      .then((res: any) => {
        console.log(res);
        this.totalBudget = res.data;
      })
      .catch(e => {
        console.error(e);
      })

  }

  addBudget(val) {
    const budget = { amount: val }
    this.budgetSrv
      .addBudget(budget)
      .then((res: any) => {
        console.log(res);
        this.loadAllBudgets();
      })
      .catch(e => {
        console.error(e);
      });
  }

  onAddCategory() {
    if (!this.catName) {
      alert("Please enter category name, to add")
      return;
    }
    const cat = { name: this.catName }
    this.categorySrv
      .addCategory(cat)
      .then((res: any) => {
        this.catName = '';
        this.loadAllCategories();

        console.log("New category added successfully");

      });
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

}
