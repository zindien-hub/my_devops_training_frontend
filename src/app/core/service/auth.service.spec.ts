import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save token in localStorage', () => {
    service.saveToken('test-token');

    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('auth_token', 'stored-token');

    const token = service.getToken();

    expect(token).toBe('stored-token');
  });

  it('should return true when user is logged in', () => {
    localStorage.setItem('auth_token', 'stored-token');

    const loggedIn = service.isLoggedIn();

    expect(loggedIn).toBe(true);
  });

  it('should return false when user is not logged in', () => {
    const loggedIn = service.isLoggedIn();

    expect(loggedIn).toBe(false);
  });

  it('should remove token from localStorage on logout', () => {
    localStorage.setItem('auth_token', 'stored-token');

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});