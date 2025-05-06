import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { Router } from '@angular/router';

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const router = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [RecuperarPasswordComponent],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
    
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with email control', () => {
    expect(component.recuperarForm).toBeDefined();
    expect(component.recuperarForm.get('email')).toBeDefined();
  });

  it('should mark form as invalid if empty email', () => {
    const emailControl = component.recuperarForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
  });

  it('should mark form as invalid if invalid email format', () => {
    const emailControl = component.recuperarForm.get('email');
    emailControl?.setValue('invalidemail');
    expect(emailControl?.valid).toBeFalsy();
  });

  it('should mark form as valid if valid email', () => {
    const emailControl = component.recuperarForm.get('email');
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    // Set form to invalid state
    component.recuperarForm.get('email')?.setValue('');
    
    // Set submitted to true (this happens in onSubmit)
    component.submitted = true;
    
    // Call onSubmit
    component.onSubmit();
    
    // Check that loading did not change
    expect(component.loading).toBeFalse();
  });

  it('should set loading to true when submitting form', fakeAsync(() => {
    // Configurar un formulario válido
    component.recuperarForm.get('email')?.setValue('test@test.com');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que loading se estableció en true
    expect(component.loading).toBeTrue();
    
    // Avanzar el tiempo para que se complete el setTimeout
    tick(1500);
    
    // Verificar que loading se estableció en false y hay un mensaje de éxito
    expect(component.loading).toBeFalse();
    expect(component.successMessage).toBeTruthy();
  }));

  it('should reset error and success messages when submitting form', () => {
    // Establecer mensajes previos
    component.errorMessage = 'Error previo';
    component.successMessage = 'Éxito previo';
    
    // Configurar un formulario válido
    component.recuperarForm.get('email')?.setValue('test@test.com');
    
    // Enviar el formulario
    component.onSubmit();
    
    // Verificar que los mensajes se resetearon
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should access form controls via f getter', () => {
    expect(component.f).toBeDefined();
    expect(component.f.email).toBe(component.recuperarForm.controls.email);
  });
});