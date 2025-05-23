import { Component, OnInit } from '@angular/core';
import { ProductoService, MovimientoInventario, Producto } from '../../modulos-compartidos/services/producto.service';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  movimientos: MovimientoInventario[] = [];
  stockBajo: Producto[] = [];
  proximosAVencer: Producto[] = [];
  categorias: string[] = ['Todos', 'Lácteos', 'Bebidas', 'Snacks', 'Abarrotes'];
  categoriaSeleccionada: string = 'Todos';

  formularioEdicion!: FormGroup;
  editando: boolean = false;
  movimientoEnEdicion!: MovimientoInventario;

  usuarioEsAdmin: boolean = false;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.usuarioEsAdmin = this.authService.getRole()?.toUpperCase() === 'ADMIN';

    this.formularioEdicion = this.fb.group({
      producto: [''],
      categoria: [''],
      cantidad: [0],
      tipo: ['ENTRADA'],
      fechaVencimiento: ['']
    });

    this.cargarMovimientos();
    this.cargarStockBajo();
    this.cargarProximosAVencer();
  }

  cargarMovimientos(): void {
    if (this.categoriaSeleccionada === 'Todos') {
      this.productoService.listarMovimientos().subscribe(data => this.movimientos = data);
    } else {
      this.productoService.filtrarPorCategoria(this.categoriaSeleccionada).subscribe(data => this.movimientos = data);
    }
  }

  cargarStockBajo(): void {
    this.productoService.listarStockBajo().subscribe(data => this.stockBajo = data);
  }

  cargarProximosAVencer(): void {
    this.productoService.listarProximosVencimientos().subscribe(data => this.proximosAVencer = data);
  }

  editarMovimiento(movimiento: MovimientoInventario): void {
    this.editando = true;
    this.movimientoEnEdicion = movimiento;
    this.formularioEdicion.patchValue(movimiento);
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.formularioEdicion.reset();
  }

  guardarCambios(): void {
    const actualizado: MovimientoInventario = {
      ...this.movimientoEnEdicion,
      ...this.formularioEdicion.value
    };
    // Aquí deberías llamar a un método del backend si tienes uno para editar.
    // Por ahora actualizamos localmente:
    this.movimientos = this.movimientos.map(m =>
      m === this.movimientoEnEdicion ? actualizado : m
    );
    this.cancelarEdicion();
  }

  aplicarFiltro(): void {
    this.cargarMovimientos();
  }
}
