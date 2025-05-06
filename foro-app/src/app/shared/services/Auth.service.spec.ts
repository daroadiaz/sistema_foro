import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegistroRequest, Usuario } from './../../shared/models/usuario.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registro', () => {
    it('should register a new user', () => {
      const registroData: RegistroRequest = {
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      const mockResponse = {
        success: true,
        message: 'Usuario registrado con éxito',
        data: {
          id: 1,
          nombre: 'Test User',
          username: 'testuser',
          email: 'test@test.com',
          rol: 'USUARIO',
          estaActivo: true,
          fechaRegistro: new Date().toISOString()
        }
      };

    service.registro(registroData).subscribe((user: Usuario) => {
      //expect(user).toEqual(mockResponse.data);
    });

      const req = httpMock.expectOne(`${apiUrl}/registro`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle error during registration', () => {
      const registroData: RegistroRequest = {
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      const mockErrorResponse = {
        success: false,
        message: 'El nombre de usuario ya existe'
      };

    service.registro(registroData).subscribe(
      () => fail('should have failed with error'),
      (error: string) => {
        expect(error).toBe('El nombre de usuario ya existe');
      }
    );

      const req = httpMock.expectOne(`${apiUrl}/registro`);
      expect(req.request.method).toBe('POST');
      req.flush(mockErrorResponse, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should login and store user in localStorage', () => {
      const loginData: LoginRequest = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };

      const mockResponse = {
        success: true,
        message: 'Login exitoso',
        data: mockUser
      };

    service.login(loginData).subscribe((user: Usuario) => {
      expect(user).toEqual(mockUser);
      const storedUser: string | null = localStorage.getItem('usuario');
      expect(storedUser).toBeTruthy();
      const parsedUser: Usuario = JSON.parse(storedUser!);
      expect(parsedUser).toEqual(mockUser);
    });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should update usuarioActual observable after login', () => {
      const loginData: LoginRequest = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };

      const mockResponse = {
        success: true,
        message: 'Login exitoso',
        data: mockUser
      };

      let usuarioActual: Usuario | null = null;
    service.usuarioActual$.subscribe((user: Usuario | null) => {
      usuarioActual = user;
    });

      service.login(loginData).subscribe(() => {
        expect(usuarioActual).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const loginData: LoginRequest = {
        username: 'testuser',
        password: 'password123'
      };

      const mockErrorResponse = {
        success: false,
        message: 'Credenciales inválidas'
      };

    service.login(loginData).subscribe(
      () => fail('should have failed with error'),
      (error: string) => {
        expect(error).toBe('Credenciales inválidas');
      }
    );

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockErrorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove user from localStorage and update usuarioActual observable', () => {
      // Primero simular que hay un usuario autenticado
      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };
      
      localStorage.setItem('usuario', JSON.stringify(mockUser));
      
      // Forzar al servicio a cargar el usuario desde localStorage
      service['cargarUsuarioDelLocalStorage']();
      
      // Verificar que el usuario se cargó correctamente
      expect(service.usuarioActual).toEqual(mockUser);
      
      // Llamar a logout
      service.logout();
      
      // Verificar que el usuario se eliminó del localStorage
      expect(localStorage.getItem('usuario')).toBeNull();
      
      // Verificar que el usuario actual es null
      expect(service.usuarioActual).toBeNull();
    });
  });

  describe('helper methods', () => {
    it('should return correct authentication status', () => {
      expect(service.estaAutenticado()).toBeFalse();
      
      // Simular un usuario autenticado
      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };
      
      localStorage.setItem('usuario', JSON.stringify(mockUser));
      service['cargarUsuarioDelLocalStorage']();
      
      expect(service.estaAutenticado()).toBeTrue();
    });

    it('should return correct admin status', () => {
      expect(service.esAdmin).toBeFalse();
      
      // Simular un usuario normal
      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };
      
      localStorage.setItem('usuario', JSON.stringify(mockUser));
      service['cargarUsuarioDelLocalStorage']();
      
      expect(service.esAdmin).toBeFalse();
      
      // Simular un usuario administrador
      const mockAdmin: Usuario = {
        id: 2,
        nombre: 'Admin User',
        username: 'adminuser',
        email: 'admin@test.com',
        rol: 'ADMINISTRADOR',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };
      
      localStorage.setItem('usuario', JSON.stringify(mockAdmin));
      service['cargarUsuarioDelLocalStorage']();
      
      expect(service.esAdmin).toBeTrue();
    });

    it('should return correct token', () => {
      expect(service.token).toBeNull();
      
      // Simular un usuario autenticado
      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };
      
      localStorage.setItem('usuario', JSON.stringify(mockUser));
      service['cargarUsuarioDelLocalStorage']();
      
      expect(service.token).toBe('fake-jwt-token');
    });

    it('should return correct username', () => {
      expect(service.username).toBeNull();
      
      // Simular un usuario autenticado
      const mockUser: Usuario = {
        id: 1,
        nombre: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        rol: 'USUARIO',
        estaActivo: true,
        fechaRegistro: new Date(),
        token: 'fake-jwt-token'
      };
      
      localStorage.setItem('usuario', JSON.stringify(mockUser));
      service['cargarUsuarioDelLocalStorage']();
      
      expect(service.username).toBe('testuser');
    });
  });
});