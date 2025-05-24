import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  imagenSeleccionada: File | null = null;

  @Output() productoGuardado = new EventEmitter<any>();

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.esEdicion = true;
      this.productoService.obtenerProducto(this.id).subscribe({
        next: (data: Producto) => this.producto = data,
        error: err => console.error('Error cargando producto', err)
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    const formData = new FormData();

    // Convertir producto a JSON y luego a Blob para enviarlo en FormData
    const productoJSON = JSON.stringify(this.producto);
    const productoBlob = new Blob([productoJSON], { type: 'application/json' });
    formData.append('producto', productoBlob);

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    if (this.esEdicion && this.id) {
      this.productoService.actualizarProducto(this.id, formData).subscribe({
        next: () => this.router.navigate(['/admin/productos']),
        error: err => console.error('Error actualizando producto', err)
      });
    } else {
      this.productoService.crearProducto(formData).subscribe({
        next: () => this.router.navigate(['/admin/productos']),
        error: err => console.error('Error creando producto', err)
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/productos']);
  }
}
