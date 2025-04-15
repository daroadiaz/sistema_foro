import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comentario, ComentarioRequest } from '../models/comentario.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private apiUrl = `${environment.apiUrl}/api/comentarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  crearComentario(comentario: ComentarioRequest): Observable<Comentario> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.post<ApiResponse>(
      `${this.apiUrl}?username=${this.authService.username}`, 
      comentario
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Comentario;
        } else {
          throw new Error(response.message || 'Error al crear el comentario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  listarComentariosPorTema(temaId: number, pagina: number, tamanio: number): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanio', tamanio.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/tema/${temaId}`, { params }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al obtener comentarios');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  listarComentariosPorUsuario(username: string): Observable<Comentario[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/usuario/${username}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Comentario[];
        } else {
          throw new Error(response.message || 'Error al obtener comentarios del usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  obtenerComentarioPorId(id: number): Observable<Comentario> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Comentario;
        } else {
          throw new Error(response.message || 'Error al obtener el comentario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  actualizarComentario(id: number, comentario: ComentarioRequest): Observable<Comentario> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}?username=${this.authService.username}`, 
      comentario
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Comentario;
        } else {
          throw new Error(response.message || 'Error al actualizar el comentario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  eliminarComentario(id: number): Observable<boolean> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${id}?username=${this.authService.username}`
    ).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          throw new Error(response.message || 'Error al eliminar el comentario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }
}