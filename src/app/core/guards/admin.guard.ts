import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

canActivate(): boolean {
  const loggedIn = this.authService.isLoggedIn();
  const role = this.authService.getRole();

  console.log('AdminGuard - loggedIn:', loggedIn, 'role:', role);

  if (loggedIn && role === 'ADMIN') {
    return true;
  } else {
    this.router.navigate(['/login']);
    return false;
  }
}

}

