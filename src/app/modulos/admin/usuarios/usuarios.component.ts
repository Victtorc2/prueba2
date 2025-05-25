import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as bcrypt from 'bcryptjs';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  usuarios: Usuario[] = [];
  usuarioActual: Usuario = this.nuevoUsuarioVacio();
  modoEdicion: boolean = false;
  mostrarModal: boolean = false;
  filtro: string = '';
  rolesDisponibles: string[] = ['ADMIN', 'EMPLEADO'];

  nuevoUsuarioVacio(): Usuario {
  return {
    id: null as any, // lo puedes tratar como number más adelante
    nombre: '',
    apellido: '',
    dni: null as any,
    correo: '',
    password: '',
    roles: []
  };
}


  guardar(): void {
  const usuario = { ...this.usuarioActual };

  if (usuario.password) {
    // Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(usuario.password, salt);
  }

  if (this.modoEdicion) {
    const index = this.usuarios.findIndex(u => u.id === usuario.id);
    if (index !== -1) {
      this.usuarios[index] = usuario;
    }
  } else {
    this.usuarios.push(usuario);
  }

  this.cerrarModal();
}



  editar(usuario: Usuario): void {
    this.usuarioActual = { ...usuario };
    this.modoEdicion = true;
    this.abrirModal();
  }

  eliminar(id: number): void {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
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

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  correo: string;
  password: string;
  roles: string[];
  activo?: boolean;
  ultimoAcceso?: string;
}
