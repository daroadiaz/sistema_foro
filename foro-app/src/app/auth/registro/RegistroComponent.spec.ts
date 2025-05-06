import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegistroComponent } from './registro.component';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['registro', 'estaAutenticado']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    authSpy.estaAutenticado.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [RegistroComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with all required controls', () => {
    expect(component.registroForm).toBeDefined();
    expect(component.registroForm.get('nombre')).toBeDefined();
    expect(component.registroForm.get('username')).toBeDefined();
    expect(component.registroForm.get('email')).toBeDefined();
    expect(component.registroForm.get('password')).toBeDefined();
    expect(component.registroForm.get('confirmPassword')).toBeDefined();
  });

  it('should mark form as invalid if empty fields', () => {
    expect(component.registroForm.valid).toBeFalsy();
  });

  it('should check if passwords match', () => {
    component.registroForm.get('password')?.setValue('Password1@');
    component.registroForm.get('confirmPassword')?.setValue('Password1@');
    
    // Ejecutar manualmente el validador
    component.mustMatch('password', 'confirmPassword')(component.registroForm);
    
    expect(component.registroForm.get('confirmPassword')?.errors?.mustMatch).toBeFalsy();

    component.registroForm.get('password')?.setValue('Password1@');
    component.registroForm.get('confirmPassword')?.setValue('Password2@');
    
    // Ejecutar manualmente el validador
    component.mustMatch('password', 'confirmPassword')(component.registroForm);
    
    expect(component.registroForm.get('confirmPassword')?.errors?.mustMatch).toBeTruthy();
  });

  it('should validate username format', () => {
    const usernameControl = component.registroForm.get('username');
    
    usernameControl?.setValue('valid_user.name-123');
    expect(usernameControl?.errors?.pattern).toBeFalsy();
    
    usernameControl?.setValue('invalid@username');
    expect(usernameControl?.errors?.pattern).toBeTruthy();
  });

  it('should validate password format', () => {
    const passwordControl = component.registroForm.get('password');
    
    passwordControl?.setValue('Password1@');
    expect(passwordControl?.errors?.pattern).toBeFalsy();
    
    passwordControl?.setValue('weakpassword');
    expect(passwordControl?.errors?.pattern).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.registroForm.get('email');
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.email).toBeFalsy();
    
    emailControl?.setValue('invalidemail');
    expect(emailControl?.errors?.email).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    // Set form to invalid state
    component.registroForm.get('nombre')?.setValue('');
    
    // Set submitted to true (this happens in onSubmit)
    component.submitted = true;
    
    // Call onSubmit
    component.onSubmit();
    
    // Check that auth service wasn't called
    expect(authServiceSpy.registro).not.toHaveBeenCalled();
  });

  it('should call authService.registro when form is valid', () => {
    // Configurar el espía del servicio
    authServiceSpy.registro.and.returnValue(of({ id: 1, nombre: 'Test User', username: 'testuser', email: 'test@test.com', rol: 'USUARIO', estaActivo: true, fechaRegistro: new Date() }));
    
    // Configurar el formulario
    component.registroForm.get('nombre')?.setValue('Test User');
    component.registroForm.get('username')?.setValue('testuser');
    component.registroForm.get('email')?.setValue('test@test.com');
    component.registroForm.get('password')?.setValue('Password1@');
    component.registroForm.get('confirmPassword')?.setValue('Password1@');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que se llamó al método registro
    expect(authServiceSpy.registro).toHaveBeenCalledWith({ 
      nombre: 'Test User',
      username: 'testuser', 
      email: 'test@test.com',
      password: 'Password1@'
    });
  });

  it('should navigate to login on successful registration', () => {
    // Configurar el espía del servicio
    authServiceSpy.registro.and.returnValue(of({ id: 1, nombre: 'Test User', username: 'testuser', email: 'test@test.com', rol: 'USUARIO', estaActivo: true, fechaRegistro: new Date() }));
    
    // Configurar el formulario
    component.registroForm.get('nombre')?.setValue('Test User');
    component.registroForm.get('username')?.setValue('testuser');
    component.registroForm.get('email')?.setValue('test@test.com');
    component.registroForm.get('password')?.setValue('Password1@');
    component.registroForm.get('confirmPassword')?.setValue('Password1@');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que se navega al login
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { registered: true } });
  });

  it('should set error message on registration failure', () => {
    // Configurar el espía del servicio para simular un error
    authServiceSpy.registro.and.returnValue(throwError('Error de registro'));
    
    // Configurar el formulario
    component.registroForm.get('nombre')?.setValue('Test User');
    component.registroForm.get('username')?.setValue('testuser');
    component.registroForm.get('email')?.setValue('test@test.com');
    component.registroForm.get('password')?.setValue('Password1@');
    component.registroForm.get('confirmPassword')?.setValue('Password1@');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que se establece el mensaje de error
    expect(component.errorMessage).toBe('Error de registro');
    expect(component.loading).toBeFalse();
  });

  it('should redirect to home if already authenticated', () => {
    // Recrear el componente con autenticación
    authServiceSpy.estaAutenticado.and.returnValue(true);
    
    // Este constructor debería redirigir
    const registroComponent = new RegistroComponent(
      TestBed.inject(FormBuilder),
      routerSpy,
      authServiceSpy
    );
    
    // Verificar que se navegó a inicio
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should access form controls via f getter', () => {
    expect(component.f).toBeDefined();
    expect(component.f.nombre).toBe(component.registroForm.controls.nombre);
    expect(component.f.username).toBe(component.registroForm.controls.username);
    expect(component.f.email).toBe(component.registroForm.controls.email);
    expect(component.f.password).toBe(component.registroForm.controls.password);
    expect(component.f.confirmPassword).toBe(component.registroForm.controls.confirmPassword);
  });
});