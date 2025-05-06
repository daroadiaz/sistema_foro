import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['estaAutenticado'], {
      'esAdmin': false
    });
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: router }
      ]
    });
    
    guard = TestBed.inject(AdminGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow admin user to access admin routes', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    (authServiceSpy as any).esAdmin = true;
    
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/admin' } as RouterStateSnapshot;
    
    expect(guard.canActivate(route, state)).toBeTrue();
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect non-admin authenticated users to forbidden', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    (authServiceSpy as any).esAdmin = false;
    
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/admin' } as RouterStateSnapshot;
    
    expect(guard.canActivate(route, state)).toBeFalse();
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forbidden']);
  });

  it('should redirect unauthenticated users to forbidden', () => {
    authServiceSpy.estaAutenticado.and.returnValue(false);
    (authServiceSpy as any).esAdmin = false;
    
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/admin' } as RouterStateSnapshot;
    
    expect(guard.canActivate(route, state)).toBeFalse();
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forbidden']);
  });
});