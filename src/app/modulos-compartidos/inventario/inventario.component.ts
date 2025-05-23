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
  columnasTabla: string[] = ['productoNombre', 'categoria', 'cantidad', 'ubicacion', 'observacion', 'tipo', 'fecha', 'acciones'];

  movimientos: MovimientoInventario[] = [];
  movimientosFiltrados: MovimientoInventario[] = [];
  productos: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'Todos';
  productoSeleccionado: Producto | null = null;

  editando = false;
  formularioEdicion!: FormGroup;
  usuarioEsAdmin = false;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.usuarioEsAdmin = this.authService.getRole()?.toUpperCase() === 'ADMIN';
    this.inicializarFormulario();
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.productoService.listarProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargarMovimientos();
        this.cargarCategorias();
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  cargarMovimientos(): void {
    this.productoService.listarMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos = movimientos.map(mov => {
          const producto = this.productos.find(p => p.id === mov.productoId);
          return {
            ...mov,
            productoNombre: producto?.nombre || 'Sin nombre',
            categoria: producto?.categoria || 'Sin categoría'
          };
        });
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

  inicializarFormulario(): void {
    this.formularioEdicion = this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tipo: ['INGRESO', Validators.required],
      ubicacion: ['', Validators.required],
      observacion: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required]
    });

    this.formularioEdicion.get('productoId')?.valueChanges.subscribe(id => {
      this.productoSeleccionado = this.productos.find(p => p.id === id) || null;
    });
  }

  aplicarFiltro(): void {
    this.movimientosFiltrados = this.categoriaSeleccionada === 'Todos' 
      ? [...this.movimientos] 
      : this.movimientos.filter(m => m.categoria === this.categoriaSeleccionada);
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
    productoId: this.productoSeleccionado.id,
    productoNombre: this.productoSeleccionado.nombre,
    categoria: this.productoSeleccionado.categoria
  };

  this.productoService.registrarMovimiento(movimiento).subscribe({
    next: () => {
      this.cargarMovimientos();
      this.cancelarEdicion();
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