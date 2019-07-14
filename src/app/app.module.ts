import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { EditExpenseComponent } from './dialogs/edit-expense/edit-expense.component';
import { EditExpenseDialogComponent } from './dialogs/edit-expense-dialog/edit-expense-dialog.component';
import { AddExpenseDialogComponent } from './dialogs/add-expense-dialog/add-expense-dialog.component';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DeleteExpenseDailogComponent } from './dialogs/delete-expense-dailog/delete-expense-dailog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    SettingsComponent,
    ProfileComponent,
    EditExpenseComponent,
    EditExpenseDialogComponent,
    AddExpenseDialogComponent,
    DeleteExpenseDailogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    ChartsModule,
    NgxDatatableModule

  ],
  entryComponents:[EditExpenseDialogComponent,
  AddExpenseDialogComponent,
  DeleteExpenseDailogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
