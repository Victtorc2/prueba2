import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole() ?? '';
    if (this.authService.isLoggedIn() && role === 'EMPLEADO') {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
