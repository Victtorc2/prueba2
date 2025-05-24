import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../../admin/productos/models/producto.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-producto-list',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent  implements OnInit {

  productos: Producto[] = [];
  filtroNombre: string = '';
  filtroCategoria: string = '';
  filtroCodigo: string = '';

  constructor(private productoService: ProductoService, private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

 crearProducto(): void {
  this.router.navigate(['/admin/productos/nuevo']);
}


  cargarProductos(): void {
    this.productoService.listarProductos(this.filtroNombre, this.filtroCategoria, this.filtroCodigo)
      .subscribe({
        next: data => this.productos = data,
        error: err => console.error('Error cargando productos', err)
      });
  }

  eliminarProducto(id: number): void {
    if(confirm('¿Seguro que quieres eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => this.cargarProductos(),
        error: err => console.error('Error eliminando producto', err)
      });
    }
  }

  buscar(): void {
    this.cargarProductos();
  }

  limpiarFiltros(): void {
    this.filtroNombre = '';
    this.filtroCategoria = '';
    this.filtroCodigo = '';
    this.cargarProductos();
  }
}
