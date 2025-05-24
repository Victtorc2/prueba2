import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  nombre: string;
  codigo: string;
  categoria: string;
  precio: number;
  stock: number;
  proveedor: string;
  presentacion: string;
  imagen: string;
  fechaVencimiento: string;
}

export interface MovimientoInventario {
  id?: number;
  productoId: number;
  cantidad: number;
  ubicacion: string;
  observacion: string;
  tipo: 'INGRESO' | 'SALIDA' | 'AJUSTE';
  fecha: string;
  productoNombre?: string;
  categoria?: string;
  precio?: number;

}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/inventario';
  private productosUrl = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  registrarMovimiento(movimiento: MovimientoInventario): Observable<any> {
    return this.http.post(`${this.baseUrl}`, movimiento);
  }

  listarMovimientos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.baseUrl}`);
  }

  filtrarPorCategoria(nombreCategoria: string): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.baseUrl}/categoria/${nombreCategoria}`);
  }

  listarStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/stock-bajo`);
  }

  listarProximosVencimientos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/proximos-a-vencer`);
  }

  listarCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categorias`);
  }

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosUrl);
  }
}