import { Component, OnInit } from '@angular/core';
import { Tema } from '../../shared/models/tema.model';
import { Comentario } from '../../shared/models/comentario.model';
import { TemaService } from '../../shared/services/tema.service';
import { ComentarioService } from '../../shared/services/comentario.service';
import { CategoriaService } from '../../shared/services/categoria.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  usuarios: number;
  categorias: number;
  temas: number;
  comentarios: number;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    usuarios: 0,
    categorias: 0,
    temas: 0,
    comentarios: 0
  };
  temasRecientes: Tema[] = [];
  comentariosRecientes: Comentario[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private temaService: TemaService,
    private comentarioService: ComentarioService,
    private categoriaService: CategoriaService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;
    
    this.stats = {
      usuarios: 10,
      categorias: 5,
      temas: 25,
      comentarios: 100
    };
    
    this.temaService.buscarTemas('', 0, 5)
      .subscribe({
        next: (response) => {
          this.temasRecientes = response.content;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar temas recientes: ' + error;
        }
      });
    
    this.comentariosRecientes = [];
    
    this.loading = false;
  }
}