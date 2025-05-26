import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductoService, Producto } from '../services/producto.service';
import { VentaService, VentaRequestDTO, VentaResponseDTO, EstadisticasVentaDTO } from '../services/ventas.service';
import { AuthService } from '../../core/services/auth.service'; // Asegúrate de tener tu servicio de autenticación importado

interface ItemVenta {
  producto: Producto;
  cantidad: number;
}

interface Filtros {
  fechaInicio: string;
  fechaFin: string;
  metodoPago: string;
  montoMinimo: number;
}

interface ResumenPeriodo {
  totalVentas: number;
  montoTotal: number;
  promedioVenta: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  tabActual: 'nueva' | 'historial' | 'estadisticas' = 'nueva';

  productoForm: FormGroup;

  productos: Producto[] = [];
  filteredProductos!: Observable<Producto[]>;

  productosVenta: ItemVenta[] = [];
  subtotal: number = 0;
  descuento: number = 0;
  impuesto: number = 0;
  total: number = 0;
  readonly TASA_IMPUESTO: number = 0.18;

  ventas: VentaResponseDTO[] = [];
  ventasFiltradas: VentaResponseDTO[] = [];
  filtros: Filtros = {
    fechaInicio: '',
    fechaFin: '',
    metodoPago: '',
    montoMinimo: 0
  };
  resumenPeriodo: ResumenPeriodo = {
    totalVentas: 0,
    montoTotal: 0,
    promedioVenta: 0
  };

  mostrarDetalleVenta: boolean = false;
  ventaSeleccionada: VentaResponseDTO | null = null;

  estadisticas: EstadisticasVentaDTO = {
    ventasHoy: 0,
    ingresosHoy: 0,
    ventasMes: 0,
    ingresosMes: 0,
    ventasPorMetodo: { efectivo: 0, tarjeta: 0 },
    productosMasVendidos: []
  };

  cargandoProductos: boolean = false;
  cargandoVentas: boolean = false;
  procesandoPago: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private authService: AuthService  // Servicio para obtener usuario autenticado
  ) {
    this.productoForm = this.fb.group({
      producto: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.configurarAutocomplete();
    this.cargarHistorialVentas();
    this.cargarEstadisticas();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargandoProductos = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.cargandoProductos = false;
      }
    });
  }

  configurarAutocomplete(): void {
    this.filteredProductos = this.productoForm.get('producto')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        const nombre = typeof value === 'string' ? value : value?.nombre || '';
        return this.filtrarProductos(nombre);
      })
    );
  }

  filtrarProductos(nombre: string): Producto[] {
    if (!nombre) return this.productos.slice(0, 10);

    const filterValue = nombre.toLowerCase();
    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(filterValue) ||
      producto.codigo.toLowerCase().includes(filterValue)
    ).slice(0, 10);
  }

  displayFn(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  cambiarTab(tab: 'nueva' | 'historial' | 'estadisticas'): void {
    this.tabActual = tab;

    if (tab === 'historial') {
      this.cargarHistorialVentas();
    } else if (tab === 'estadisticas') {
      this.cargarEstadisticas();
    }
  }

  agregarProducto(): void {
    if (this.productoForm.valid) {
      const producto = this.productoForm.get('producto')!.value;
      const cantidad = this.productoForm.get('cantidad')!.value;

      if (producto.stock < cantidad) {
        alert(`Stock insuficiente. Stock disponible: ${producto.stock}`);
        return;
      }

      const index = this.productosVenta.findIndex(item => item.producto.id === producto.id);

      if (index !== -1) {
        const cantidadTotal = this.productosVenta[index].cantidad + cantidad;
        if (producto.stock < cantidadTotal) {
          alert(`Stock insuficiente. Stock disponible: ${producto.stock}`);
          return;
        }
        this.productosVenta[index].cantidad = cantidadTotal;
      } else {
        this.productosVenta.push({ producto, cantidad });
      }

      this.calcularTotales();
      this.productoForm.patchValue({
        producto: null,
        cantidad: 1
      });
    }
  }

  eliminarProducto(index: number): void {
    this.productosVenta.splice(index, 1);
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.subtotal = this.productosVenta.reduce(
      (sum, item) => sum + (item.producto.precio * item.cantidad), 0
    );
    this.impuesto = this.subtotal * this.TASA_IMPUESTO;
    this.total = this.subtotal + this.impuesto - this.descuento;
  }

procesarPago(metodoPago: 'efectivo' | 'tarjeta'): void {
  if (this.productosVenta.length === 0) return;

  const usuarioId = this.authService.getUserId(); // Obtener el id del usuario desde el token

  if (!usuarioId) {
    alert('Usuario no autenticado');
    return;
  }

  const ventaRequest: VentaRequestDTO = {
    usuarioId: usuarioId,  // Asignar el usuarioId al request
    detalles: this.productosVenta.map(item => ({
      productoId: item.producto.id!,
      cantidad: item.cantidad
    })),
    metodoPago: metodoPago.toUpperCase(),
    descuento: this.descuento
  };

  this.procesandoPago = true;
  this.ventaService.registrarVenta(ventaRequest).subscribe({
    next: (response) => {
      this.procesandoPago = false;
      alert(`Venta procesada con éxito mediante ${metodoPago}. Total: S/ ${response.total.toFixed(2)}`);
      this.cancelarVenta();
      this.cargarHistorialVentas();
      this.cargarEstadisticas();
    },
    error: (error) => {
      this.procesandoPago = false;
      console.error('Error al procesar la venta:', error);
      alert('Error al procesar la venta. Por favor, intente nuevamente.');
    }
  });
}


  cancelarVenta(): void {
    this.productosVenta = [];
    this.calcularTotales();
    this.productoForm.reset({
      producto: null,
      cantidad: 1
    });
  }

cargarHistorialVentas(): void {
  this.cargandoVentas = true;
  this.ventaService.obtenerHistorial().subscribe({
    next: (ventas) => {
      console.log('Ventas recibidas:', ventas);  // Verificar qué datos se están recibiendo
      this.ventas = ventas;
   this.aplicarFiltros();  
      this.cargandoVentas = false;
    },
    error: (error) => {
      console.error('Error al cargar historial:', error);
      this.cargandoVentas = false;
    }
  });
}



aplicarFiltros(): void {
  this.ventasFiltradas = this.ventas.filter(venta => {
    let cumpleFiltros = true;
    const fechaVenta = new Date(venta.fecha);

    if (this.filtros.fechaInicio) {
      const fechaInicio = new Date(this.filtros.fechaInicio);
      cumpleFiltros = cumpleFiltros && fechaVenta >= fechaInicio;
    }

    if (this.filtros.fechaFin) {
      const fechaFin = new Date(this.filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      cumpleFiltros = cumpleFiltros && fechaVenta <= fechaFin;
    }

    if (this.filtros.metodoPago) {
      cumpleFiltros = cumpleFiltros && venta.metodoPago.toLowerCase() === this.filtros.metodoPago.toLowerCase();
    }

    if (this.filtros.montoMinimo > 0) {
      cumpleFiltros = cumpleFiltros && venta.total >= this.filtros.montoMinimo;
    }

    return cumpleFiltros;
  });

  this.calcularResumenPeriodo();
}



  limpiarFiltros(): void {
    this.filtros = {
      fechaInicio: '',
      fechaFin: '',
      metodoPago: '',
      montoMinimo: 0
    };
    this.aplicarFiltros();
  }

  calcularResumenPeriodo(): void {
    this.resumenPeriodo.totalVentas = this.ventasFiltradas.length;
    this.resumenPeriodo.montoTotal = this.ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
    this.resumenPeriodo.promedioVenta = this.resumenPeriodo.totalVentas > 0
      ? this.resumenPeriodo.montoTotal / this.resumenPeriodo.totalVentas
      : 0;
  }

  cargarEstadisticas(): void {
    this.ventaService.obtenerEstadisticas().subscribe({
      next: (estadisticas) => {
        this.estadisticas = estadisticas;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }

  verDetalleVenta(venta: VentaResponseDTO): void {
    this.ventaSeleccionada = venta;
    this.mostrarDetalleVenta = true;
  }

  cerrarDetalleVenta(): void {
    this.mostrarDetalleVenta = false;
    this.ventaSeleccionada = null;
  }

  imprimirVenta(venta: VentaResponseDTO): void {
    console.log('Imprimiendo venta:', venta);
    alert(`Imprimiendo venta #${venta.id}`);
  }

  exportarExcel(): void {
    console.log('Exportando a Excel:', this.ventasFiltradas);
    alert('Exportando historial de ventas a Excel...');
  }
}
