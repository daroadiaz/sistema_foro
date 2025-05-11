import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria, CategoriaRequest } from '../../shared/models/categoria.model';
import { CategoriaService } from '../../shared/services/categoria.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = true;
  errorMessage = '';
  categoriaForm!: FormGroup;
  categoriaSeleccionada: Categoria | null = null;
  submitted = false;
  isAdmin = false;

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categoriaForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['']
    });
    
    this.isAdmin = this.authService.esAdmin;
    this.cargarCategorias();
  }

  get f() { return this.categoriaForm.controls; }

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

  seleccionarCategoria(categoria: Categoria): void {
    this.categoriaSeleccionada = categoria;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion
    });
  }

  crearCategoria(): void {
    this.submitted = true;
    
    if (this.categoriaForm.invalid) {
      return;
    }
    
    const categoriaRequest: CategoriaRequest = {
      nombre: this.f.nombre.value,
      descripcion: this.f.descripcion.value
    };
    
    this.categoriaService.crearCategoria(categoriaRequest)
      .subscribe({
        next: () => {
          const modalElement = document.getElementById('nuevaCategoriaModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
          
          this.categoriaForm.reset();
          this.submitted = false;
          
          this.cargarCategorias();
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  actualizarCategoria(): void {
    this.submitted = true;
    
    if (this.categoriaForm.invalid || !this.categoriaSeleccionada) {
      return;
    }
    
    const categoriaRequest: CategoriaRequest = {
      nombre: this.f.nombre.value,
      descripcion: this.f.descripcion.value
    };
    
    this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.id, categoriaRequest)
      .subscribe({
        next: () => {
          const modalElement = document.getElementById('editarCategoriaModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
          
          this.categoriaForm.reset();
          this.submitted = false;
          this.categoriaSeleccionada = null;
          
          this.cargarCategorias();
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id)
        .subscribe({
          next: () => {
            this.cargarCategorias();
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
    }
  }
}