import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Agrega esta línea
})
export class LoginComponent {
  correo = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onLogin(): void {
    if (!this.correo || !this.password) return;

    this.isLoading = true;

    this.authService.login({ correo: this.correo, password: this.password }).subscribe({
      next: () => {
        this.snackBar.open('Bienvenido al sistema Interno', 'Cerrar', { duration: 3000 });
        const role = this.authService.getRole();

        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'EMPLEADO') {
          this.router.navigate(['/empleado']);
        } else {
          this.router.navigate(['/inicio']);
        }
      },
      error: () => {
        this.snackBar.open('Credenciales incorrectas', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}
