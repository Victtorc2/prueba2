import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductosComponent } from './productos.component';
import { ProductoFormComponent } from './producto-form/producto-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProductosComponent,
  },
  {
    path: 'nuevo',
    component: ProductoFormComponent
  },
  {
    path: 'editar/:id',
    component: ProductoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule {}  
