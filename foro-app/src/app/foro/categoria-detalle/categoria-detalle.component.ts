import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from '../../shared/models/categoria.model';
import { Tema } from '../../shared/models/tema.model';
import { CategoriaService } from '../../shared/services/categoria.service';
import { TemaService } from '../../shared/services/tema.service';

@Component({
  selector: 'app-categoria-detalle',
  templateUrl: './categoria-detalle.component.html',
  styleUrls: ['./categoria-detalle.component.scss']
})
export class CategoriaDetalleComponent implements OnInit {
  categoria!: Categoria;
  temas: Tema[] = [];
  loading = true;
  loadingTemas = false;
  errorMessage = '';
  paginaActual = 0;
  totalPaginas = 0;
  tamanioPagina = 10;

  constructor(
    private route: ActivatedRoute,
    private categoriaService: CategoriaService,
    private temaService: TemaService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.cargarCategoria(id);
        this.cargarTemas(id);
      }
    });
  }

  cargarCategoria(id: number): void {
    this.loading = true;
    this.categoriaService.obtenerCategoriaPorId(id)
      .subscribe({
        next: (categoria) => {
          this.categoria = categoria;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
  }

  cargarTemas(categoriaId: number, pagina: number = 0): void {
    this.loadingTemas = true;
    this.temaService.listarTemasPorCategoriaPaginados(categoriaId, pagina, this.tamanioPagina)
      .subscribe({
        next: (response) => {
          this.temas = response.content;
          this.paginaActual = response.number;
          this.totalPaginas = response.totalPages;
          this.loadingTemas = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.loadingTemas = false;
        }
      });
  }

  cambiarPagina(pagina: number): void {
    if (this.categoria) {
      this.cargarTemas(this.categoria.id, pagina);
    }
  }
}