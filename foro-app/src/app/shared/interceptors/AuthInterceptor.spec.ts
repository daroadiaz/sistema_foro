import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      'token': null
    });
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: router }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add Authorization header when token is null', () => {
    (authServiceSpy as any).token = null;
    
    httpClient.get('/api/test').subscribe();
    
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should add Authorization header when token exists', () => {
    (authServiceSpy as any).token = 'fake-token';
    
    httpClient.get('/api/test').subscribe();
    
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush({});
  });

  it('should handle 401 error by logging out and redirecting to login', () => {
    (authServiceSpy as any).token = 'fake-token';
    
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 401 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(authServiceSpy.logout).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should pass through other errors', () => {
    (authServiceSpy as any).token = 'fake-token';
    
    httpClient.get('/api/test').subscribe(
      () => fail('should have failed with 500 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(authServiceSpy.logout).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
      }
    );
    
    const req = httpMock.expectOne('/api/test');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});