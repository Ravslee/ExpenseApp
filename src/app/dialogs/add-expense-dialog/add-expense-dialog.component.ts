import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.css']
})
export class AddExpenseDialogComponent implements OnInit {
  public categories:any[];
  constructor(
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>,
    @Inject(MAT_DIALOG_DATA)public data: any,
    private categorySrv: CategoryService) {
     
     }

  ngOnInit() {
    this.loadAllCategories()
  }
  cancel(): void {
    this.dialogRef.close();
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
