import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'estaAutenticado']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    authSpy.estaAutenticado.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/' }
            }
          }
        }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with username and password controls', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should mark form as invalid if empty username', () => {
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('password123');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as invalid if empty password', () => {
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should mark form as valid with username and password', () => {
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    // Set form to invalid state
    component.loginForm.get('username')?.setValue('');
    
    // Set submitted to true (this happens in onSubmit)
    component.submitted = true;
    
    // Call onSubmit
    component.onSubmit();
    
    // Check that auth service wasn't called
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid', () => {
    // Configurar el espía del servicio
    authServiceSpy.login.and.returnValue(of({ id: 1, nombre: 'Test User', username: 'testuser', email: 'test@test.com', rol: 'USUARIO', estaActivo: true, fechaRegistro: new Date() }));
    
    // Configurar el formulario
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que se llamó al método login
    expect(authServiceSpy.login).toHaveBeenCalledWith({ 
      username: 'testuser', 
      password: 'password123' 
    });
  });

  it('should navigate to returnUrl on successful login', () => {
    // Configurar el espía del servicio
    authServiceSpy.login.and.returnValue(of({ id: 1, nombre: 'Test User', username: 'testuser', email: 'test@test.com', rol: 'USUARIO', estaActivo: true, fechaRegistro: new Date() }));
    
    // Configurar el formulario
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que se navega al returnUrl
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set error message on login failure', () => {
    // Configurar el espía del servicio para simular un error
    authServiceSpy.login.and.returnValue(throwError('Error de autenticación'));
    
    // Configurar el formulario
    component.loginForm.get('username')?.setValue('testuser');
    component.loginForm.get('password')?.setValue('password123');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que se establece el mensaje de error
    expect(component.errorMessage).toBe('Error de autenticación');
    expect(component.loading).toBeFalse();
  });

  it('should redirect to home if already authenticated', () => {
    // Recrear el componente con autenticación
    authServiceSpy.estaAutenticado.and.returnValue(true);
    
    // Este constructor debería redirigir
    const loginComponent = new LoginComponent(
      TestBed.inject(FormBuilder),
      TestBed.inject(ActivatedRoute),
      routerSpy,
      authServiceSpy
    );
    
    // Verificar que se navegó a inicio
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should access form controls via f getter', () => {
    expect(component.f).toBeDefined();
    expect(component.f.username).toBe(component.loginForm.controls.username);
    expect(component.f.password).toBe(component.loginForm.controls.password);
  });
});