import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentasComponent } from './ventas.component';
import { RouterModule } from '@angular/router';
import { VentasRoutingModule } from './ventas-routing.module';

@NgModule({
  declarations: [VentasComponent],
  imports: [
    CommonModule,
    VentasRoutingModule
  ]
})
export class VentasModule {}
