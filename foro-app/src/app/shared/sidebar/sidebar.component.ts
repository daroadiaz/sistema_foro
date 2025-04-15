import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CategoriaService } from '../../shared/services/categoria.service';
import { Categoria } from '../../shared/models/categoria.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  errorMessage = '';
  isAuthenticated = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.estaAutenticado();
    this.isAdmin = this.authService.esAdmin;
    this.cargarCategorias();

    this.authService.usuarioActual$.subscribe(usuario => {
      this.isAuthenticated = !!usuario;
      this.isAdmin = this.authService.esAdmin;
    });
  }

  cargarCategorias(): void {
    this.loading = true;
    this.categoriaService.listarCategorias()
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
  }
}