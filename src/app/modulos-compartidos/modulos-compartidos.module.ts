import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulosCompartidosRoutingModule } from './modulos-compartidos-routing.module';

import { InicioComponent } from './inicio/inicio.component';
import { InventarioComponent } from './inventario/inventario.component';
import { VentasComponent } from './ventas/ventas.component';

import { FormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    InicioComponent,
    InventarioComponent,
    VentasComponent
  ],
  imports: [
    CommonModule,
    ModulosCompartidosRoutingModule,
    FormsModule,

    MatFormFieldModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,

    MatTableModule,
    MatInputModule
  ],
  exports: [
    InicioComponent,
    InventarioComponent,
    VentasComponent
  ]
})
export class ModulosCompartidosModule { }
