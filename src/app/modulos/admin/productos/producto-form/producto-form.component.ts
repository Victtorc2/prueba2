import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../models/producto.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {

  producto: Producto = new Producto();
  id?: number;
  esEdicion: boolean = false;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.esEdicion = true;
      this.productoService.obtenerProducto(this.id).subscribe({
        next: data => this.producto = data,
        error: err => console.error('Error cargando producto', err)
      });
    }
  }

  guardar(form: NgForm): void {
  if (form.invalid) return;

  if (this.esEdicion && this.id) {
    this.productoService.actualizarProducto(this.id, this.producto).subscribe({
      next: () => this.router.navigate(['/admin/productos']),
      error: err => console.error('Error actualizando producto', err)
    });
  } else {
    this.productoService.crearProducto(this.producto).subscribe({
      next: () => this.router.navigate(['/admin/productos']), // regresa al listado
      error: err => console.error('Error creando producto', err)
    });
  }
}


  cancelar(): void {
    this.router.navigate(['/admin/productos']);
  }
}
