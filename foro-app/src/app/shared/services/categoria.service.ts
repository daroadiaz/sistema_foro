import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Categoria, CategoriaRequest } from '../models/categoria.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/api/categorias`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Categoria[];
        } else {
          throw new Error(response.message || 'Error al obtener categorías');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  obtenerCategoriaPorId(id: number): Observable<Categoria> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Categoria;
        } else {
          throw new Error(response.message || 'Error al obtener la categoría');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  crearCategoria(categoria: CategoriaRequest): Observable<Categoria> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.post<ApiResponse>(
      `${this.apiUrl}?adminUsername=${this.authService.username}`, 
      categoria
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Categoria;
        } else {
          throw new Error(response.message || 'Error al crear la categoría');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  actualizarCategoria(id: number, categoria: CategoriaRequest): Observable<Categoria> {
    if (!this.authService.username) {
      return throwError(() => 'No hay un usuario autenticado');
    }

    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${id}?adminUsername=${this.authService.username}`, 
      categoria
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data as Categoria;
        } else {
          throw new Error(response.message || 'Error al actualizar la categoría');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }

  eliminarCategoria(id: number): Observable<any> {
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
          throw new Error(response.message || 'Error al eliminar la categoría');
        }
      }),
      catchError(error => {
        return throwError(() => error.error?.message || 'Error en el servidor');
      })
    );
  }
}