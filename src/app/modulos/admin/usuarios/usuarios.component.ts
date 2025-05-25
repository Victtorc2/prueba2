import { Component, OnInit } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { UsuarioService, Usuario } from 'src/app/modulos/admin/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioActual: Usuario = this.nuevoUsuarioVacio();
  modoEdicion: boolean = false;
  mostrarModal: boolean = false;
  filtro: string = '';
  rolesDisponibles: string[] = ['ADMIN', 'EMPLEADO'];


  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  nuevoUsuarioVacio(): Usuario {
  return {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    roles: []
  };
}


guardar(): void { 
  const usuario = { ...this.usuarioActual };

  if (!this.modoEdicion && !usuario.password) {
    console.warn('Contraseña requerida para nuevo usuario');
    return;
  }

  if (usuario.roles.length === 0) {
    console.warn('Debe asignar al menos un rol');
    return;
  }

  console.log('Usuario a guardar:', usuario);

  this.usuarioService.guardar(usuario).subscribe({
    next: (resp) => {
      if (this.modoEdicion) {
        const index = this.usuarios.findIndex(u => u.id === resp.id);
        if (index !== -1) {
          this.usuarios[index] = resp;
        }
      } else {
        this.usuarios.push(resp);
      }
      this.cerrarModal();
    },
    error: (err) => console.error('Error al guardar usuario:', err)
  });
}


  editar(usuario: Usuario): void {
    this.usuarioActual = { ...usuario };
    this.modoEdicion = true;
    this.abrirModal();
  }

  eliminar(id: number): void {
    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
      },
      error: (err) => console.error('Error al eliminar usuario:', err)
    });
  }

  cancelar(): void {
    this.usuarioActual = this.nuevoUsuarioVacio();
    this.modoEdicion = false;
    this.cerrarModal();
  }

  getIniciales(nombre: string, apellido: string): string {
    return (nombre?.charAt(0) || '') + (apellido?.charAt(0) || '');
  }

  usuariosFiltrados(): Usuario[] {
    if (!this.filtro) return this.usuarios;
    const texto = this.filtro.toLowerCase();
    return this.usuarios.filter(
      u =>
        u.nombre.toLowerCase().includes(texto) ||
        u.apellido.toLowerCase().includes(texto) ||
        u.correo.toLowerCase().includes(texto)
    );
  }

  prepararNuevoUsuario() {
    this.usuarioActual = this.nuevoUsuarioVacio();
    this.modoEdicion = false;
    this.abrirModal();
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  toggleRol(rol: string): void {
    const index = this.usuarioActual.roles.indexOf(rol);
    if (index === -1) {
      this.usuarioActual.roles.push(rol);
    } else {
      this.usuarioActual.roles.splice(index, 1);
    }
  }
}
