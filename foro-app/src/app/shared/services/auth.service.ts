import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Usuario, LoginRequest, RegistroRequest } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarUsuarioDelLocalStorage();
  }

  private cargarUsuarioDelLocalStorage(): void {
    const usuarioAlmacenado = localStorage.getItem('usuario');
    if (usuarioAlmacenado) {
      const usuario: Usuario = JSON.parse(usuarioAlmacenado);
      this.usuarioActualSubject.next(usuario);
    }
  }

  registro(datos: RegistroRequest): Observable<Usuario> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/registro`, datos).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Usuario;
        } else {
          throw new Error(response.message || 'Error al registrar usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  login(datos: LoginRequest): Observable<Usuario> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, datos).pipe(
      map(response => {
        if (response.success && response.data) {
          const usuario = response.data as Usuario;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.usuarioActualSubject.next(usuario);
          return usuario;
        } else {
          throw new Error(response.message || 'Error al iniciar sesión');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.usuarioActualSubject.next(null);
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  get token(): string | null {
    return this.usuarioActual?.token || null;
  }

  get username(): string | null {
    return this.usuarioActual?.username || null;
  }

  get esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMINISTRADOR';
  }

  estaAutenticado(): boolean {
    return !!this.usuarioActual;
  }
}