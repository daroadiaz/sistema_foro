import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Tema, TemaRequest } from '../models/tema.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TemaService {
  private apiUrl = `${environment.apiUrl}/api/temas`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  crearTema(tema: TemaRequest): Observable<Tema> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.post<ApiResponse>(
      `${this.apiUrl}?username=${this.authService.username}`, 
      tema
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema;
        } else {
          throw new Error(response.message || 'Error al crear el tema');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  listarTemasPorCategoria(categoriaId: number): Observable<Tema[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/categoria/${categoriaId}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema[];
        } else {
          throw new Error(response.message || 'Error al obtener temas');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  listarTemasPorCategoriaPaginados(categoriaId: number, pagina: number, tamanio: number): Observable<any> {
    let params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanio', tamanio.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/categoria/${categoriaId}/pagina`, { params }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al obtener temas');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  buscarTemas(query: string, pagina: number, tamanio: number): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('pagina', pagina.toString())
      .set('tamanio', tamanio.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/buscar`, { params }).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Error al buscar temas');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  obtenerTemaPorId(id: number): Observable<Tema> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema;
        } else {
          throw new Error(response.message || 'Error al obtener el tema');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  listarTemasPorUsuario(username: string): Observable<Tema[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/usuario/${username}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema[];
        } else {
          throw new Error(response.message || 'Error al obtener temas del usuario');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  actualizarTema(id: number, tema: TemaRequest): Observable<Tema> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}?username=${this.authService.username}`, 
      tema
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Tema;
        } else {
          throw new Error(response.message || 'Error al actualizar el tema');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  eliminarTema(id: number): Observable<boolean> {
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
          throw new Error(response.message || 'Error al eliminar el tema');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }
}