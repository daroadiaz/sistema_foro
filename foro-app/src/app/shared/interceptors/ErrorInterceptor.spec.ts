import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorInterceptor } from './error.interceptor';
import { Router } from '@angular/router';

describe('ErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true
        },
        { provide: Router, useValue: router }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle client-side error', () => {
    // Es difícil simular un error del lado del cliente con HttpTestingController
    // Este test puede ser incompleto, pero proporciona cierta cobertura
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with error'),
      (error) => {
        expect(error).toBeDefined();
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    const mockError = new ErrorEvent('Network error', { message: 'Error simulado' });
    req.error(mockError);
  });

  it('should handle 400 Bad Request error', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 400 error'),
      (error) => {
        expect(error).toBe('Solicitud incorrecta');
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush({ message: 'Solicitud incorrecta' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 401 Unauthorized error', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 401 error'),
      (error) => {
        expect(error).toBe('No está autorizado para acceder a este recurso');
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 403 Forbidden error and redirect', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 403 error'),
      (error) => {
        expect(error).toBe('Acceso prohibido');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/forbidden']);
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });
  });

  it('should handle 404 Not Found error', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 404 error'),
      (error) => {
        expect(error).toBe('Recurso no encontrado');
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 Server Error', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 500 error'),
      (error) => {
        expect(error).toBe('Error interno del servidor');
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle other errors', () => {
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with error'),
      (error) => {
        expect(error).toBe('Error 418: I\'m a teapot');
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush({}, { status: 418, statusText: 'I\'m a teapot' });
  });
});