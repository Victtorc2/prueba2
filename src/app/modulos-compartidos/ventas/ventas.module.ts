import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';

// Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    VentasComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule
  ]
})
export class VentasModule { }