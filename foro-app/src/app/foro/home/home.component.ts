import { Component, OnInit } from '@angular/core';
import { Tema } from '../../shared/models/tema.model';
import { CategoriaService } from '../../shared/services/categoria.service';
import { TemaService } from '../../shared/services/tema.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  temasMasRecientes: Tema[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private categoriaService: CategoriaService,
    private temaService: TemaService
  ) { }

  ngOnInit(): void {
    this.cargarTemasRecientes();
  }

  cargarTemasRecientes(): void {
    this.temaService.buscarTemas('', 0, 10)
      .subscribe({
        next: (response) => {
          this.temasMasRecientes = response.content;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
  }
}