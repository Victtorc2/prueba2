import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from '../../layout/main-layout/main-layout.component';
import { ProductosComponent } from './productos/productos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { ReportesComponent } from './reportes/reportes.component';


 

const routes: Routes = [
  {
  path: '',
  component: MainLayoutComponent,
  children: [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' }, // // <-- muestra un dashboard o algo aquí
    { path: 'productos', component: ProductosComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'auditoria', component: AuditoriaComponent },
    { path: 'reportes', component: ReportesComponent },
    // elimina esta línea
    // { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  ]
}



     
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
