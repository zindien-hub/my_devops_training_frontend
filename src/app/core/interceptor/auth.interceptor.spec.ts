import { HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../service/auth.service';

describe('authInterceptor', () => {
  let authServiceMock: { getToken: jest.Mock };

  beforeEach(() => {
    authServiceMock = {
      getToken: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
  });

  it('should forward original request when no token is available', () => {
    authServiceMock.getToken.mockReturnValue(null);
    const req = new HttpRequest('GET', '/api/students');
    const next = jest.fn((request: HttpRequest<unknown>) => of(new HttpResponse({ status: 200, body: request.url })));

    TestBed.runInInjectionContext(() => authInterceptor(req, next));

    expect(next).toHaveBeenCalledTimes(1);
    const forwardedRequest = next.mock.calls[0][0] as HttpRequest<unknown>;
    expect(forwardedRequest).toBe(req);
    expect(forwardedRequest.headers.has('Authorization')).toBe(false);
  });

  it('should add Authorization header when token is available', () => {
    authServiceMock.getToken.mockReturnValue('jwt-token');
    const req = new HttpRequest('GET', '/api/students');
    const next = jest.fn((request: HttpRequest<unknown>) => of(new HttpResponse({ status: 200, body: request.url })));

    TestBed.runInInjectionContext(() => authInterceptor(req, next));

    expect(next).toHaveBeenCalledTimes(1);
    const forwardedRequest = next.mock.calls[0][0] as HttpRequest<unknown>;
    expect(forwardedRequest).not.toBe(req);
    expect(forwardedRequest.headers.get('Authorization')).toBe('Bearer jwt-token');
  });
});
