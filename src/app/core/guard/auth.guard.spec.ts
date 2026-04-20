import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

describe('authGuard', () => {
  let authServiceMock: { isLoggedIn: jest.Mock };
  let routerMock: { createUrlTree: jest.Mock };

  beforeEach(() => {
    // Faux service d'authentification pour contrôler l'état de connexion
    authServiceMock = {
      isLoggedIn: jest.fn()
    };

    // Faux router pour simuler une redirection sans utiliser le vrai Router Angular
    routerMock = {
      createUrlTree: jest.fn().mockReturnValue({} as UrlTree)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow access when user is logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);

    // Le guard utilise inject(), donc on l'exécute dans le contexte d'injection Angular
    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(result).toBe(true);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
  });

  it('should redirect to /login when user is not logged in', () => {
    const mockUrlTree = {} as UrlTree;

    authServiceMock.isLoggedIn.mockReturnValue(false);
    routerMock.createUrlTree.mockReturnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() => authGuard(null as any, null as any));

    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(mockUrlTree);
  });
});