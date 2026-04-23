import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let userServiceMock: { login: jest.Mock };
  let authServiceMock: { saveToken: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    // Faux services pour contrôler le comportement pendant le test
    userServiceMock = {
      login: jest.fn()
    };

    authServiceMock = {
      saveToken: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    component.loginForm.setValue({
      login: '',
      password: ''
    });

    expect(component.loginForm.invalid).toBe(true);
  });

  it('should call login, save token and navigate to /students on success', () => {
    const mockResponse = {
      token: 'mocked-jwt-token'
    };

    userServiceMock.login.mockReturnValue(of(mockResponse));

    component.loginForm.setValue({
      login: 'john.doe',
      password: 'password123'
    });

    component.onSubmit();

    // Vérifie que le service de login a bien été appelé
    expect(userServiceMock.login).toHaveBeenCalledWith({
      login: 'john.doe',
      password: 'password123'
    });

    // Vérifie que le token est sauvegardé
    expect(authServiceMock.saveToken).toHaveBeenCalledWith('mocked-jwt-token');

    // Vérifie la redirection après connexion réussie
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should set errorMessage when login fails', () => {
    userServiceMock.login.mockReturnValue(
      throwError(() => ({
        error: { message: 'Invalid credentials' }
      }))
    );

    component.loginForm.setValue({
      login: 'john.doe',
      password: 'wrong-password'
    });

    component.onSubmit();

    // Vérifie que le message d'erreur est bien renseigné
    expect(component.errorMessage).toBe('Invalid credentials');

    // Vérifie qu'aucun token n'est sauvegardé en cas d'échec
    expect(authServiceMock.saveToken).not.toHaveBeenCalled();

    // Vérifie qu'il n'y a pas de redirection en cas d'échec
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should set default errorMessage when login fails without backend message', () => {
    userServiceMock.login.mockReturnValue(
      throwError(() => ({}))
    );

    component.loginForm.setValue({
      login: 'john.doe',
      password: 'wrong-password'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Erreur lors de la connexion');
  });
});