import { Component, OnInit } from '@angular/core';
import { Categoria } from '../../shared/models/categoria.model';
import { Tema } from '../../shared/models/tema.model';
import { CategoriaService } from '../../shared/services/categoria.service';
import { TemaService } from '../../shared/services/tema.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categorias: Categoria[] = [];
  temasMasRecientes: Tema[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private categoriaService: CategoriaService,
    private temaService: TemaService
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarTemasMasRecientes();
  }

  cargarCategorias(): void {
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

  cargarTemasMasRecientes(): void {
    // Cargar temas más recientes de la primera categoría (o puedes implementar otra lógica)
    setTimeout(() => {
      if (this.categorias.length > 0) {
        this.temaService.listarTemasPorCategoriaPaginados(this.categorias[0].id, 0, 5)
          .subscribe({
            next: (response) => {
              this.temasMasRecientes = response.content;
            },
            error: (error) => {
              this.errorMessage = error;
            }
          });
      }
    }, 1000);
  }
}