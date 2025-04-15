import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Usuario, RegistroRequest } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  listarUsuarios(): Observable<Usuario[]> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.get<ApiResponse>(`${this.apiUrl}?adminUsername=${this.authService.username}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Usuario[];
        } else {
          throw new Error(response.message || 'Error al obtener usuarios');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Usuario;
        } else {
          throw new Error(response.message || 'Error al obtener el usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  obtenerUsuarioPorUsername(username: string): Observable<Usuario> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/username/${username}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Usuario;
        } else {
          throw new Error(response.message || 'Error al obtener el usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  actualizarUsuario(id: number, usuario: RegistroRequest): Observable<Usuario> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}?username=${this.authService.username}`, 
      usuario
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Usuario;
        } else {
          throw new Error(response.message || 'Error al actualizar el usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  eliminarUsuario(id: number): Observable<boolean> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${id}?adminUsername=${this.authService.username}`
    ).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          throw new Error(response.message || 'Error al eliminar el usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  desactivarUsuario(id: number): Observable<boolean> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}/desactivar?adminUsername=${this.authService.username}`, 
      {}
    ).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          throw new Error(response.message || 'Error al desactivar el usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  activarUsuario(id: number): Observable<boolean> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}/activar?adminUsername=${this.authService.username}`, 
      {}
    ).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          throw new Error(response.message || 'Error al activar el usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }
}