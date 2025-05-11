import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tema } from '../../shared/models/tema.model';
import { TemaService } from '../../shared/services/tema.service';
import { AdminService } from '../../shared/services/admin.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-temas',
  templateUrl: './admin-temas.component.html',
  styleUrls: ['./admin-temas.component.scss']
})
export class AdminTemasComponent implements OnInit {
  temas: Tema[] = [];
  loading = true;
  errorMessage = '';
  paginaActual = 0;
  totalPaginas = 0;
  tamanioPagina = 10;
  mostrarBaneados = false;
  banForm!: FormGroup;
  temaSeleccionado: Tema | null = null;
  submitted = false;
  modalBan: any;

  constructor(
    private temaService: TemaService,
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.banForm = this.formBuilder.group({
      razonBaneo: ['', [Validators.required, Validators.minLength(5)]]
    });
    
    this.cargarTemas();
  }

  get banF() { return this.banForm.controls; }

  toggleMostrarBaneados(mostrar: boolean): void {
    if (this.mostrarBaneados !== mostrar) {
      this.mostrarBaneados = mostrar;
      this.paginaActual = 0;
      this.cargarTemas();
    }
  }

  cargarTemas(): void {
    this.loading = true;
    
    if (this.mostrarBaneados) {
      this.adminService.listarTemasBaneados(this.paginaActual, this.tamanioPagina)
        .subscribe({
          next: (response) => {
            this.temas = response.content;
            this.paginaActual = response.number;
            this.totalPaginas = response.totalPages;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = error;
            this.loading = false;
          }
        });
    } else {
      this.temaService.buscarTemas('', this.paginaActual, this.tamanioPagina)
        .subscribe({
          next: (response) => {
            this.temas = response.content;
            this.paginaActual = response.number;
            this.totalPaginas = response.totalPages;
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = error;
            this.loading = false;
          }
        });
    }
  }

  cambiarPagina(pagina: number): void {
    if (pagina !== this.paginaActual) {
      this.paginaActual = pagina;
      this.cargarTemas();
    }
  }

  abrirModalBan(tema: Tema): void {
    this.temaSeleccionado = tema;
    this.banForm.reset();
    this.submitted = false;
    
    this.modalBan = new bootstrap.Modal(document.getElementById('banModal'));
    this.modalBan.show();
  }

  banearTema(): void {
    this.submitted = true;
    
    if (this.banForm.invalid || !this.temaSeleccionado) {
      return;
    }
    
    const banRequest = {
      razonBaneo: this.banF.razonBaneo.value
    };
    
    this.adminService.banearTema(this.temaSeleccionado.id, banRequest)
      .subscribe({
        next: () => {
          this.modalBan.hide();
          this.cargarTemas();
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  desbanearTema(id: number): void {
    if (confirm('¿Estás seguro de que deseas desbanear este tema?')) {
      this.adminService.desbanearTema(id)
        .subscribe({
          next: () => {
            this.cargarTemas();
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
    }
  }

  eliminarTema(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer.')) {
      this.temaService.eliminarTema(id)
        .subscribe({
          next: () => {
            this.cargarTemas();
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
    }
  }
}