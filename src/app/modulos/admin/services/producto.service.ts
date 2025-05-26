import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../productos/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/api/productos';  // Ajusta URL según tu backend

  constructor(private http: HttpClient) { }

  listarProductos(nombre?: string, categoria?: string, codigo?: string, precio?: number): Observable<Producto[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (categoria) params = params.set('categoria', categoria);
    if (codigo) params = params.set('codigo', codigo);
    if (precio) params = params.set('precio', precio);
    return this.http.get<Producto[]>(this.apiUrl, { params });
  }

  obtenerProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  // Estos métodos manejan FormData con producto + imagen
  crearProducto(productoFormData: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, productoFormData);
  }

  actualizarProducto(id: number, productoFormData: FormData): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, productoFormData);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  productosProximosAVencer(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/alertas/vencimiento`);
  }

  productosStockBajo(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/alertas/stock-bajo`);
  }

}
