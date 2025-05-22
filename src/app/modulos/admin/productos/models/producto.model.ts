export class Producto {
  id: number = 0;
  nombre: string = '';
  codigo: string = '';
  categoria: string = '';
  stock: number = 0;
  proveedor?: string;
  presentacion?: string;
  imagen?: string;
  fechaVencimiento?: string; // ISO string format yyyy-MM-dd
}
