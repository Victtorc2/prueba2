import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VentaRequestDTO {
  productos: Array<{
    productoId: number;
    cantidad: number;
  }>;
  metodoPago: string;
  descuento?: number;
}

export interface VentaResponseDTO {
  id: number;
  fecha: string;
  productos: Array<{
    producto: any;
    cantidad: number;
    subtotal: number;
  }>;
  subtotal: number;
  impuesto: number;
  descuento: number;
  total: number;
  metodoPago: string;
}

export interface EstadisticasVentaDTO {
  ventasHoy: number;
  ingresosHoy: number;
  ventasMes: number;
  ingresosMes: number;
  ventasPorMetodo: {
    efectivo: number;
    tarjeta: number;
  };
  productosMasVendidos: Array<{
    nombre: string;
    cantidadVendida: number;
    ingresos: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:8085/api/ventas';

  constructor(private http: HttpClient) {}

  registrarVenta(venta: VentaRequestDTO): Observable<VentaResponseDTO> {
    return this.http.post<VentaResponseDTO>(this.apiUrl, venta);
  }

  obtenerHistorial(): Observable<VentaResponseDTO[]> {
    return this.http.get<VentaResponseDTO[]>(`${this.apiUrl}/historial`);
  }

  obtenerEstadisticas(): Observable<EstadisticasVentaDTO> {
    return this.http.get<EstadisticasVentaDTO>(`${this.apiUrl}/estadisticas`);
  }
}