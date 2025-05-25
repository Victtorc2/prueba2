import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;         // el ? lo hace opcional (puede estar ausente o undefined)
  nombre: string;
  apellido: string;
  dni?: number;        // opcional
  correo: string;
  password: string;
  roles: string[];
  activo?: boolean;
  ultimoAcceso?: string;
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listar(): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
}


  guardar(usuario: Usuario): Observable<Usuario> {
  if (usuario.id) {
    // Actualizar usuario con PUT en /api/usuarios/{id}
    return this.http.put<Usuario>(`${this.apiUrl}/${usuario.id}`, usuario, { headers: this.getHeaders() });
  } else {
    // Crear usuario con POST en /api/usuarios
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario, { headers: this.getHeaders() });
  }
}

eliminar(id: number): Observable<void> {
  // Eliminar usuario con DELETE en /api/usuarios/{id}
  return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
}

}
