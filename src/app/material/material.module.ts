import { NgModule } from '@angular/core';
import {MatButtonModule,MatDialogModule,MatCardModule} from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule
  ],
  exports:[
    MatButtonModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class MaterialModule { }
