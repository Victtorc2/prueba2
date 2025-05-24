import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ProductoFormComponent } from './productos/producto-form/producto-form.component';
import { FormsModule } from '@angular/forms';

// Importa los módulos de Angular Material que necesitas
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
// crea este componente



@NgModule({
  declarations: [
    ProductosComponent,
    UsuariosComponent,
    AuditoriaComponent,
    ReportesComponent,
    ProductoFormComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,

    // Agrega estos imports para Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AdminModule { }
