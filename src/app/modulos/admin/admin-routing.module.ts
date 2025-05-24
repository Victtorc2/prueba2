import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ProductoFormComponent } from './productos/producto-form/producto-form.component';
 

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'productos/nuevo', component: ProductoFormComponent },
      { path: 'productos/editar/:id', component: ProductoFormComponent },


      { path: 'usuarios', component: UsuariosComponent },
      { path: 'auditoria', component: AuditoriaComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
