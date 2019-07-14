import { NgModule } from '@angular/core';
import {MatButtonModule,MatDialogModule} from '@angular/material';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports:[
    MatButtonModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
