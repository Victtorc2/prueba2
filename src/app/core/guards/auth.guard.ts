import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
  const loggedIn = this.authService.isLoggedIn();
  const role = this.authService.getRole();
  console.log('AuthGuard - loggedIn:', loggedIn, 'role:', role);
  if (loggedIn) {
    return true;
  } else {
    this.router.navigate(['/login']);
    return false;
  }
}

}