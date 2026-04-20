import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { Register } from '../models/Register';
import { Login } from '../models/Login';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il ne reste pas de requête HTTP non traitée
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call POST /api/register', () => {
    const registerUser: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'john.doe',
      password: 'password123'
    };

    service.register(registerUser).subscribe();

    // Intercepte la requête attendue vers l'API
    const req = httpMock.expectOne('/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerUser);

    // Simule une réponse vide du backend
    req.flush({});
  });

  it('should call POST /api/login', () => {
    const loginUser: Login = {
      login: 'john.doe',
      password: 'password123'
    };

    const mockResponse = {
      token: 'mocked-jwt-token'
    };

    service.login(loginUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginUser);

    // Simule la réponse du backend contenant le token
    req.flush(mockResponse);
  });
});