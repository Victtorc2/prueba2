import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MovimientoInventario {
  id?: number;
  producto: string;
  categoria: string;
  cantidad: number;
  fechaVencimiento?: string;
  stock: number;
  tipo: string; // 'ENTRADA' o 'SALIDA'
}

export interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  stock: number;
  fechaVencimiento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = 'http://localhost:8080/api/inventario'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) {}

  // Registrar un nuevo movimiento
  registrarMovimiento(movimiento: MovimientoInventario): Observable<any> {
    return this.http.post(`${this.baseUrl}`, movimiento);
  }

  // Listar todos los movimientos
  listarMovimientos(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.baseUrl}`);
  }

  // Filtrar movimientos por categoría
  filtrarPorCategoria(nombreCategoria: string): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(`${this.baseUrl}/categoria/${nombreCategoria}`);
  }

  // Obtener productos con stock bajo (stock < 10)
  listarStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/stock-bajo`);
  }

  // Obtener productos próximos a vencer (<= 7 días)
  listarProximosVencimientos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/proximos-vencimientos`);
  }
}
