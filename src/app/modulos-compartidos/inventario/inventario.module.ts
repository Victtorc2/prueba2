import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioComponent } from './inventario.component';
import { RouterModule } from '@angular/router';


import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';


import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';


import { InventarioRoutingModule } from './inventario-routing.module';
 
@NgModule({
  declarations: [InventarioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,

    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    InventarioRoutingModule,
        MatListModule

  ]
})
export class InventarioModule { }
