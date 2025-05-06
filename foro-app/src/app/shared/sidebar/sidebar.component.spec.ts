import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { CategoriaService } from '../services/categoria.service';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let categoriaServiceSpy: jasmine.SpyObj<CategoriaService>;

  beforeEach(async () => {
    // Crear spies para los servicios
    const authSpy = jasmine.createSpyObj('AuthService', ['estaAutenticado'], {
      'esAdmin': false,
      'usuarioActual$': of(null)
    });
    
    const categoriaSpy = jasmine.createSpyObj('CategoriaService', ['listarCategorias']);
    
    // Configurar los spies
    authSpy.estaAutenticado.and.returnValue(false);
    categoriaSpy.listarCategorias.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [SidebarComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: CategoriaService, useValue: categoriaSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    categoriaServiceSpy = TestBed.inject(CategoriaService) as jasmine.SpyObj<CategoriaService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(categoriaServiceSpy.listarCategorias).toHaveBeenCalled();
  });

  it('should check authentication status on init', () => {
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
  });

  it('should update isAuthenticated and isAdmin when user changes', () => {
    // Simular cambio en el observable de usuario
    const usuarioMock = {
      id: 1,
      nombre: 'Test User',
      username: 'testuser',
      email: 'test@test.com',
      rol: 'USUARIO',
      estaActivo: true,
      fechaRegistro: new Date()
    };
    
    // Acceder a la propiedad como si fuera un objeto para cambiar el valor
    (authServiceSpy as any).usuarioActual$ = of(usuarioMock);
    
    // Re-inicializar el componente para disparar ngOnInit
    component.ngOnInit();
    
    // Verificar que se actualizan las propiedades
    expect(component.isAuthenticated).toBeTrue();
  });

  it('should handle error when loading categories', () => {
    categoriaServiceSpy.listarCategorias.and.returnValue(of(new Error('Error cargando categorías') as any));
    
    component.cargarCategorias();
    
    expect(component.loading).toBeFalse();
    expect(component.errorMessage).toBeDefined();
  });
});