import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['estaAutenticado']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: router }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow the authenticated user to access app', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/protected' } as RouterStateSnapshot;
    
    expect(guard.canActivate(route, state)).toBeTrue();
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should redirect an unauthenticated user to the login page', () => {
    authServiceSpy.estaAutenticado.and.returnValue(false);
    
    const route = new ActivatedRouteSnapshot();
    const state = { url: '/protected' } as RouterStateSnapshot;
    
    expect(guard.canActivate(route, state)).toBeFalse();
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/protected' } });
  });
});