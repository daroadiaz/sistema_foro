import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tema } from '../../shared/models/tema.model';
import { Comentario, ComentarioRequest } from '../../shared/models/comentario.model';
import { TemaService } from '../../shared/services/tema.service';
import { ComentarioService } from '../../shared/services/comentario.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-tema-detalle',
  templateUrl: './tema-detalle.component.html',
  styleUrls: ['./tema-detalle.component.scss']
})
export class TemaDetalleComponent implements OnInit {
  tema!: Tema;
  comentarios: Comentario[] = [];
  loading = true;
  loadingComentarios = false;
  errorMessage = '';
  comentarioForm!: FormGroup;
  comentarioSubmitted = false;
  isAutenticado = false;
  esAutor = false;
  esAdmin = false;
  paginaActual = 0;
  totalPaginas = 0;
  tamanioPagina = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private temaService: TemaService,
    private comentarioService: ComentarioService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.comentarioForm = this.formBuilder.group({
      contenido: ['', [Validators.required, Validators.minLength(10)]]
    });

    this.isAutenticado = this.authService.estaAutenticado();
    this.esAdmin = this.authService.esAdmin;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarTema(id);
      this.cargarComentarios(id);
    } else {
      this.router.navigate(['/']);
    }
  }

  get f() { return this.comentarioForm.controls; }

  cargarTema(id: number): void {
    this.temaService.obtenerTemaPorId(id)
      .subscribe({
        next: (tema) => {
          this.tema = tema;
          this.esAutor = this.isAutenticado && 
            this.tema.autor.username === this.authService.username;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
  }

  cargarComentarios(temaId: number, pagina: number = 0): void {
    this.loadingComentarios = true;
    this.comentarioService.listarComentariosPorTema(temaId, pagina, this.tamanioPagina)
      .subscribe({
        next: (response) => {
          this.comentarios = response.content;
          this.paginaActual = response.number;
          this.totalPaginas = response.totalPages;
          this.loadingComentarios = false;
        },
        error: (error) => {
          this.errorMessage = error;
          this.loadingComentarios = false;
        }
      });
  }

  cambiarPagina(pagina: number): void {
    if (this.tema) {
      this.cargarComentarios(this.tema.id, pagina);
    }
  }

  enviarComentario(): void {
    this.comentarioSubmitted = true;

    if (this.comentarioForm.invalid) {
      return;
    }

    const comentarioRequest: ComentarioRequest = {
      contenido: this.f.contenido.value,
      temaId: this.tema.id
    };

    this.comentarioService.crearComentario(comentarioRequest)
      .subscribe({
        next: () => {
          this.comentarioForm.reset();
          this.comentarioSubmitted = false;
          this.cargarComentarios(this.tema.id, 0); // Recargar primera página
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  eliminarTema(): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer.')) {
      this.temaService.eliminarTema(this.tema.id)
        .subscribe({
          next: () => {
            this.router.navigate(['/categorias']);
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
    }
  }
}