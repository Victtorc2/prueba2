import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../../admin/productos/models/producto.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-list',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  productosAVencer: Producto[] = [];
  productosStockBajo: Producto[] = [];

  filtroNombre: string = '';
  categoriaSeleccionada: string = '';
  categorias: string[] = []; // Puedes poblarla desde el backend si deseas

  selectedTabIndex: number = 0;

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProductosAVencer();
    this.cargarProductosStockBajo();
  }



cargarProductos(): void {
  this.productoService.listarProductos().subscribe(productos => {
    this.productos = productos.map(p => {
      if (p.id) {
        p.imagenUrl = `http://localhost:8080/api/productos/${p.id}/imagen`;
      }
      return p;
    });
  });
}



  cargarProductosAVencer(): void {
    this.productoService.productosProximosAVencer()
      .subscribe(data => this.productosAVencer = data);
  }

  cargarProductosStockBajo(): void {
    this.productoService.productosStockBajo()
      .subscribe(data => this.productosStockBajo = data);
  }

  aplicarFiltro(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filtroNombre = input.trim().toLowerCase();
    this.cargarProductos();
  }

  filtrarPorCategoria(): void {
    this.cargarProductos();
  }

  abrirDialogo(): void {
    this.router.navigate(['/admin/productos/nuevo']);
  }


  editarProducto(producto: Producto): void {
    this.router.navigate(['/admin/productos/editar', producto.id]);
  }

  eliminarProducto(producto: Producto): void {
    if (confirm(`¿Seguro que deseas eliminar el producto "${producto.nombre}"?`)) {
      this.productoService.eliminarProducto(producto.id!)
        .subscribe(() => {
          this.cargarProductos();
          this.cargarProductosAVencer();
          this.cargarProductosStockBajo();
        });
    }
  }

  isProximoAVencer(fecha: string | null): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaVencimiento = new Date(fecha);
    const diferencia = (fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24);
    return diferencia <= 7 && diferencia >= 0;
  }
}
