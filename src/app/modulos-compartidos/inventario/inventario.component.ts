import { Component, OnInit } from '@angular/core';
import { ProductoService, MovimientoInventario, Producto } from '../../modulos-compartidos/services/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  columnasTabla: string[] = ['productoNombre', 'categoria','precio', 'cantidad', 'ubicacion', 'observacion', 'tipo', 'fecha', 'acciones'];

  movimientos: MovimientoInventario[] = [];
  movimientosFiltrados: MovimientoInventario[] = [];
  productos: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'Todos';
  productoSeleccionado: Producto | null = null;

  productosProximosVencer: Producto[] = [];
  productosBajoStock: Producto[] = [];

  textoBusqueda: string = '';
  indicePestania: number = 0;
  textoCategoria: string = '';

  editando = false;
  formularioEdicion!: FormGroup;
  usuarioEsAdmin = false;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.usuarioEsAdmin = this.authService.getRole()?.toUpperCase() === 'ADMIN';
    this.inicializarFormulario();
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    // Primero cargamos productos para el select y demás usos
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        // Después de cargar productos, cargamos movimientos para asegurar relación producto-movimiento
        this.cargarMovimientos();
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  this.cargarMovimientos();
    this.cargarCategorias();
    this.cargarProductosProximosVencer();
    this.cargarProductosBajoStock();
  }

  cargarMovimientos(): void {
    this.productoService.listarMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos = movimientos.map(mov => ({
          ...mov,
          productoNombre: mov.productoNombre || 'Sin nombre',
          categoria: mov.categoria || 'Sin categoría',
          precio: mov.precio ?? 0
        }));
        this.aplicarFiltro();
      },
      error: (err) => console.error('Error al cargar movimientos', err)
    });
  }

  cargarCategorias(): void {
    this.productoService.listarCategorias().subscribe({
      next: (categorias) => this.categorias = categorias,
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarProductosProximosVencer(): void {
    this.productoService.listarProximosVencimientos().subscribe({
      next: (prods) => this.productosProximosVencer = prods,
      error: (err) => console.error('Error al cargar productos próximos a vencer', err)
    });
  }

  cargarProductosBajoStock(): void {
    this.productoService.listarStockBajo().subscribe({
      next: (prods) => this.productosBajoStock = prods,
      error: (err) => console.error('Error al cargar productos con stock bajo', err)
    });
  }

  inicializarFormulario(): void {
    this.formularioEdicion = this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tipo: ['INGRESO', Validators.required],
      ubicacion: ['', Validators.required],
      observacion: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required]
    });

    // Cuando cambie el productoId en el formulario, actualizar productoSeleccionado
    this.formularioEdicion.get('productoId')?.valueChanges.subscribe(id => {
      this.productoSeleccionado = this.productos.find(p => p.id === id) || null;
    });
  }

  cambiarPestania(index: number): void {
    this.indicePestania = index;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    let tipoFiltro = '';
    switch (this.indicePestania) {
      case 0: tipoFiltro = 'INGRESO'; break;
      case 1: tipoFiltro = 'SALIDA'; break;
      case 2: tipoFiltro = 'AJUSTE'; break;
      case 3: tipoFiltro = ''; break;
    }

    this.movimientosFiltrados = this.movimientos.filter(mov => {
      const coincideTipo = tipoFiltro ? mov.tipo === tipoFiltro : true;
      const coincideProducto = (mov.productoNombre ?? '').toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const coincideCategoria = (mov.categoria ?? '').toLowerCase().includes(this.textoCategoria.toLowerCase());
      return coincideTipo && coincideProducto && coincideCategoria;
    });
  }

  abrirFormularioNuevo(): void {
    this.editando = true;
    this.formularioEdicion.reset({
      productoId: null,
      cantidad: 1,
      tipo: 'INGRESO',
      ubicacion: '',
      observacion: '',
      fecha: new Date().toISOString().substring(0, 10)
    });
    this.productoSeleccionado = null;
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.formularioEdicion.reset();
    this.productoSeleccionado = null;
  }

  guardarCambios(): void {
    if (this.formularioEdicion.invalid || !this.productoSeleccionado) return;

    const movimiento: MovimientoInventario = {
      ...this.formularioEdicion.value,
      productoId: this.productoSeleccionado.id!,
      productoNombre: this.productoSeleccionado.nombre,
      categoria: this.productoSeleccionado.categoria,
      precio: this.productoSeleccionado.precio ?? 0
    };

    this.productoService.registrarMovimiento(movimiento).subscribe({
      next: () => {
        this.cargarMovimientos();
        this.cancelarEdicion();
        this.cargarDatosIniciales();
      },
      error: (err) => console.error('Error al guardar movimiento', err)
    });
  }

  editarMovimiento(movimiento: MovimientoInventario): void {
    if (!this.usuarioEsAdmin) return;

    this.editando = true;
    this.formularioEdicion.patchValue({
      productoId: movimiento.productoId,
      cantidad: movimiento.cantidad,
      ubicacion: movimiento.ubicacion,
      observacion: movimiento.observacion,
      tipo: movimiento.tipo,
      fecha: movimiento.fecha.substring(0, 10)
    });
    this.productoSeleccionado = this.productos.find(p => p.id === movimiento.productoId) || null;
  }
}
