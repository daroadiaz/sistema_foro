import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../shared/models/categoria.model';
import { TemaRequest } from '../../shared/models/tema.model';
import { CategoriaService } from '../../shared/services/categoria.service';
import { TemaService } from '../../shared/services/tema.service';

@Component({
  selector: 'app-nuevo-tema',
  templateUrl: './nuevo-tema.component.html',
  styleUrls: ['./nuevo-tema.component.scss']
})
export class NuevoTemaComponent implements OnInit {
  temaForm!: FormGroup;
  categorias: Categoria[] = [];
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService,
    private temaService: TemaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.temaForm = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      categoriaId: ['', [Validators.required]],
      contenido: ['', [Validators.required, Validators.minLength(10)]]
    });
    
    this.cargarCategorias();
    
    this.route.queryParams.subscribe(params => {
      const categoriaId = params['categoriaId'];
      if (categoriaId) {
        this.temaForm.patchValue({ categoriaId });
      }
    });
  }

  get f() { return this.temaForm.controls; }

  cargarCategorias(): void {
    this.categoriaService.listarCategorias()
      .subscribe({
        next: (categorias) => {
          this.categorias = categorias;
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.temaForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const temaRequest: TemaRequest = {
      titulo: this.f.titulo.value,
      categoriaId: Number(this.f.categoriaId.value),
      contenido: this.f.contenido.value
    };
    
    this.temaService.crearTema(temaRequest)
      .subscribe({
        next: (tema) => {
          this.router.navigate(['/tema', tema.id]);
        },
        error: (error) => {
          this.errorMessage = error;
          this.loading = false;
        }
      });
  }
}