import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service'
import { BudgetService } from '../../services/budget.service'
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public categories: any = ['item1', 'item2', 'item3', 'item5', 'item2', 'item3', 'item5', 'item1', 'item2', 'item3', 'item5', 'item2', 'item3', 'item5'];
  public totalBudget: any;
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
  public onUpdateTotalBudget(val: any) {
    if (!val) {
      alert("Please enter value for Total budget")
    }
    if (this.totalBudget && this.totalBudget._id) {
      this.updateBudget(val, this.totalBudget._id);
    } else {
      this.addBudget(val)
    }

  }

  updateBudget(val, id) {
    const budget = { amount: val }
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
        this.totalBudget = res.data;
      })
      .catch(e => {
        console.error(e);
      });
  }

  onAddCategory(name: any) {
    if (!name) {
      alert("Please enter category name, to add")
      return;
    }
    const cat = { name }
    this.categorySrv
      .addCategory(cat)
      .then((res: any) => {
        alert("New category added successfully");
        this.loadAllCategories();
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
