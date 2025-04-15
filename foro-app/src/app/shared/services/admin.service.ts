import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { Tema } from '../models/tema.model';
import { Comentario } from '../models/comentario.model';
import { Usuario, RegistroRequest } from '../models/usuario.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface BanRequest {
  razonBaneo: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  registrarAdmin(admin: RegistroRequest): Observable<Usuario> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.post<ApiResponse>(
      `${this.apiUrl}/registrar-admin?adminUsername=${this.authService.username}`,
      admin
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Usuario;
        } else {
          throw new Error(response.message || 'Error al registrar administrador');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  banearTema(temaId: number, request: BanRequest): Observable<Tema> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/tema/${temaId}/banear?adminUsername=${this.authService.username}`,
      request
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema;
        } else {
          throw new Error(response.message || 'Error al banear tema');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  desbanearTema(temaId: number): Observable<Tema> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/tema/${temaId}/desbanear?adminUsername=${this.authService.username}`,
      {}
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema;
        } else {
          throw new Error(response.message || 'Error al desbanear tema');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  banearComentario(comentarioId: number, request: BanRequest): Observable<Comentario> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/comentario/${comentarioId}/banear?adminUsername=${this.authService.username}`,
      request
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Comentario;
        } else {
          throw new Error(response.message || 'Error al banear comentario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  desbanearComentario(comentarioId: number): Observable<Comentario> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/comentario/${comentarioId}/desbanear?adminUsername=${this.authService.username}`,
      {}).pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data as Comentario;
          } else {
            throw new Error(response.message || 'Error al desbanear comentario');
          }
        }),
        catchError(error => {
          return throwError(() => error.error?.message || 'Error en el servidor');
        })
      );
  }

  listarTemasBaneados(pagina: number, tamanio: number): Observable<any> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanio', tamanio.toString())
      .set('adminUsername', this.authService.username);

    return this.http.get<ApiResponse>(`${this.apiUrl}/temas-baneados`, { params }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al obtener temas baneados');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  listarComentariosBaneados(pagina: number, tamanio: number): Observable<any> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanio', tamanio.toString())
      .set('adminUsername', this.authService.username);

    return this.http.get<ApiResponse>(`${this.apiUrl}/comentarios-baneados`, { params }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al obtener comentarios baneados');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }
}