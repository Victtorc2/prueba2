import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { EmpleadoGuard } from './core/guards/empleado.guard';


const routes: Routes = [
  { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', canActivate: [AuthGuard, AdminGuard], loadChildren: () => import('./modulos/admin/admin.module').then(m => m.AdminModule) },
  { 
  path: 'empleado', 
  canActivate: [AuthGuard, EmpleadoGuard], 
  loadChildren: () => import('./modulos-compartidos/modulos-compartidos.module').then(m => m.ModulosCompartidosModule) 
},


  
 { path: 'inicio', loadChildren: () => import('./modulos-compartidos/inicio/inicio.module').then(m => m.InicioModule) },
{ path: 'ventas', loadChildren: () => import('./modulos-compartidos/ventas/ventas.module').then(m => m.VentasModule) },
{ path: 'inventario', loadChildren: () => import('./modulos-compartidos/inventario/inventario.module').then(m => m.InventarioModule) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
