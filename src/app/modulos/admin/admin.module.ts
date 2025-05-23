import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { InicioComponent } from '../../modulos-compartidos/inicio/inicio.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductosComponent } from './productos/productos.component';
import { InventarioComponent } from '../../modulos-compartidos/inventario/inventario.component';
import { VentasComponent } from '../../modulos-compartidos/ventas/ventas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ProductoFormComponent } from './productos/producto-form/producto-form.component';
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
    DashboardComponent,
    ProductosComponent,
    InventarioComponent,
    VentasComponent,
    UsuariosComponent,
    AuditoriaComponent,
    ReportesComponent,
    
    ProductoFormComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,

    MatFormFieldModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,

    MatTableModule,  
    MatInputModule
    
  ]
})
export class AdminModule { }
