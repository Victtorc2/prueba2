import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/core/services/auth.service'; // Ajusta ruta según estructura

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  rol: string | null = null;
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Obtener rol del usuario
    this.rol = this.authService.getRole();

    // Puedes cargar info de usuario desde un servicio o localStorage
    // Ejemplo básico:
    this.user = {
      correo: localStorage.getItem('correo') || 'usuario@ejemplo.com'
    };
  }

  logout(): void {
    this.authService.logout();
  }
}
