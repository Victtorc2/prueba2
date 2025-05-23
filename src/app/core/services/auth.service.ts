import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ruta base sin duplicar el /login
  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Inicia sesión enviando correo y contraseña
   * Guarda el token y rol en localStorage
   */
  login(credentials: { correo: string; password: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); // ROLE_ADMIN o ROLE_EMPLEADO
      })
    );
  }

  /**
   * Limpia sesión y redirige al login
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  /**
   * Retorna el token guardado
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Retorna el rol guardado
   */
  getRole(): string | null {
  let role = localStorage.getItem('role');
  if (!role) return null;
  role = role.trim().toUpperCase(); // Quitar espacios y poner en mayúsculas
  if (role.startsWith('ROLE_')) {
    role = role.substring(5); // Quitar el prefijo 'ROLE_'
  }
  return role; // Ejemplo: "ADMIN" o "EMPLEADO"
}


  /**
   * Verifica si hay un token
   */
 isLoggedIn(): boolean {
  const token = this.getToken();
  // Puedes agregar aquí una validación extra de expiración si quieres
  return !!token; 
}
}
