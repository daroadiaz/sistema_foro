import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemaDetalleComponent } from './tema-detalle.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TemaService } from '../../shared/services/tema.service';
import { ComentarioService } from '../../shared/services/comentario.service';
import { AuthService } from '../../shared/services/auth.service';

describe('TemaDetalleComponent', () => {
  let component: TemaDetalleComponent;
  let fixture: ComponentFixture<TemaDetalleComponent>;
  let temaServiceSpy: jasmine.SpyObj<TemaService>;
  let comentarioServiceSpy: jasmine.SpyObj<ComentarioService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Crear spies para los servicios
    const temaServiceMock = jasmine.createSpyObj('TemaService', ['obtenerTemaPorId', 'eliminarTema']);
    const comentarioServiceMock = jasmine.createSpyObj('ComentarioService', ['listarComentariosPorTema', 'crearComentario']);
    const authServiceMock = jasmine.createSpyObj('AuthService', ['estaAutenticado'], {
      'username': 'testuser',
      'esAdmin': false
    });
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    // Configurar comportamiento de los spies
    temaServiceMock.obtenerTemaPorId.and.returnValue(of({
      id: 1,
      titulo: 'Test Tema',
      contenido: 'Contenido de prueba',
      fechaCreacion: new Date(),
      autor: { username: 'testuser', id: 1, nombre: 'Test User', email: 'test@test.com', rol: 'USUARIO', estaActivo: true, fechaRegistro: new Date() },
      nombreCategoria: 'Test Categoria',
      estaBaneado: false,
      numeroComentarios: 0
    }));
    comentarioServiceMock.listarComentariosPorTema.and.returnValue(of({
      content: [],
      number: 0,
      totalPages: 0
    }));
    authServiceMock.estaAutenticado.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [TemaDetalleComponent],
      providers: [
        { provide: TemaService, useValue: temaServiceMock },
        { provide: ComentarioService, useValue: comentarioServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    temaServiceSpy = TestBed.inject(TemaService) as jasmine.SpyObj<TemaService>;
    comentarioServiceSpy = TestBed.inject(ComentarioService) as jasmine.SpyObj<ComentarioService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tema on init', () => {
    expect(temaServiceSpy.obtenerTemaPorId).toHaveBeenCalledWith(1);
    expect(component.tema).toBeDefined();
  });

  it('should load comentarios on init', () => {
    expect(comentarioServiceSpy.listarComentariosPorTema).toHaveBeenCalled();
  });

  it('should check authentication status on init', () => {
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
  });

  it('should set esAutor to true if user is the author', () => {
    expect(component.esAutor).toBeTrue();
  });

  it('should cambiarPagina and load comentarios for that page', () => {
    // Resetear el spy de listarComentariosPorTema
    comentarioServiceSpy.listarComentariosPorTema.calls.reset();
    
    // Cambiar a la página 2
    component.cambiarPagina(2);
    
    // Verificar que se cargaron los comentarios para la página 2
    expect(comentarioServiceSpy.listarComentariosPorTema).toHaveBeenCalledWith(1, 2, component.tamanioPagina);
  });

  it('should handle error when loading tema', () => {
    temaServiceSpy.obtenerTemaPorId.and.returnValue(throwError('Error cargando tema'));
    
    // Inicializar componente de nuevo para probar el error
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Error cargando tema');
    expect(component.loading).toBeFalse();
  });

  it('should handle error when loading comentarios', () => {
    comentarioServiceSpy.listarComentariosPorTema.and.returnValue(throwError('Error cargando comentarios'));
    
    // Inicializar componente de nuevo para probar el error
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('Error cargando comentarios');
    expect(component.loadingComentarios).toBeFalse();
  });

  it('should not submit comentario if form is invalid', () => {
    // Invalidar el formulario
    component.comentarioForm.get('contenido')?.setValue('');
    component.comentarioSubmitted = true;
    
    // Enviar comentario
    component.enviarComentario();
    
    // Verificar que no se llamó al servicio
    expect(comentarioServiceSpy.crearComentario).not.toHaveBeenCalled();
  });

  it('should submit comentario and reload comments if form is valid', () => {
    // Configurar el servicio para devolver un comentario exitoso
    comentarioServiceSpy.crearComentario.and.returnValue(of({
      id: 1,
      contenido: 'Test comentario',
      fechaCreacion: new Date(),
      autor: { username: 'testuser', id: 1, nombre: 'Test User', email: 'test@test.com', rol: 'USUARIO', estaActivo: true, fechaRegistro: new Date() },
      temaId: 1,
      estaBaneado: false
    }));
    
    // Resetear el spy de listarComentariosPorTema
    comentarioServiceSpy.listarComentariosPorTema.calls.reset();
    
    // Configurar el formulario
    component.comentarioForm.get('contenido')?.setValue('Este es un comentario de prueba con más de 10 caracteres');
    
    // Enviar comentario
    component.enviarComentario();
    
    // Verificar que se llamó al servicio
    expect(comentarioServiceSpy.crearComentario).toHaveBeenCalled();
    
    // Verificar que se recargaron los comentarios de la primera página
    expect(comentarioServiceSpy.listarComentariosPorTema).toHaveBeenCalledWith(1, 0, component.tamanioPagina);
    
    // Verificar que se reinició el formulario
    expect(component.comentarioForm.get('contenido')?.value).toBeFalsy();
    expect(component.comentarioSubmitted).toBeFalse();
  });

  it('should handle error when submitting comentario', () => {
    // Configurar el servicio para devolver un error
    comentarioServiceSpy.crearComentario.and.returnValue(throwError('Error creando comentario'));
    
    // Configurar el formulario
    component.comentarioForm.get('contenido')?.setValue('Este es un comentario de prueba con más de 10 caracteres');
    
    // Enviar comentario
    component.enviarComentario();
    
    // Verificar que se estableció el mensaje de error
    expect(component.errorMessage).toBe('Error creando comentario');
  });

  it('should eliminate tema and navigate to categorias if confirmed', () => {
    // Simular confirm() retornando true
    spyOn(window, 'confirm').and.returnValue(true);
    
    // Configurar el servicio para devolver éxito
    temaServiceSpy.eliminarTema.and.returnValue(of(true));
    
    // Eliminar tema
    component.eliminarTema();
    
    // Verificar que se llamó al servicio
    expect(temaServiceSpy.eliminarTema).toHaveBeenCalledWith(1);
    
    // Verificar que se navegó a categorías
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/categorias']);
  });

  it('should not eliminate tema if not confirmed', () => {
    // Simular confirm() retornando false
    spyOn(window, 'confirm').and.returnValue(false);
    
    // Eliminar tema
    component.eliminarTema();
    
    // Verificar que no se llamó al servicio
    expect(temaServiceSpy.eliminarTema).not.toHaveBeenCalled();
  });

  it('should handle error when eliminating tema', () => {
    // Simular confirm() retornando true
    spyOn(window, 'confirm').and.returnValue(true);
    
    // Configurar el servicio para devolver un error
    temaServiceSpy.eliminarTema.and.returnValue(throwError('Error eliminando tema'));
    
    // Eliminar tema
    component.eliminarTema();
    
    // Verificar que se estableció el mensaje de error
    expect(component.errorMessage).toBe('Error eliminando tema');
  });

  it('should access form controls via f getter', () => {
    expect(component.f).toBeDefined();
    expect(component.f.contenido).toBe(component.comentarioForm.controls.contenido);
  });
});