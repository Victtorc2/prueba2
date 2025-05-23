import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Core imports
import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { EmpleadoGuard } from './core/guards/empleado.guard';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';



// Import módulo layout y módulos funcionales
import { LayoutModule } from './layout/layout.module';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    LayoutModule,
    
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminGuard,
    EmpleadoGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
