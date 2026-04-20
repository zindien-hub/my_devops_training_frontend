import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let userServiceMock: { register: jest.Mock };
  let routerMock: { navigate: jest.Mock };

  beforeEach(async () => {
    // Faux service utilisateur pour simuler l'inscription
    userServiceMock = {
      register: jest.fn()
    };

    // Faux router pour vérifier la redirection après succès
    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when fields are empty', () => {
    component.registerForm.setValue({
      firstName: '',
      lastName: '',
      login: '',
      password: ''
    });

    expect(component.registerForm.invalid).toBe(true);
  });

  it('should call register and navigate to /login on success', () => {
    userServiceMock.register.mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john.doe',
      password: 'password123'
    });

    // Évite l'ouverture réelle de l'alerte pendant le test
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmit();

    // Vérifie que le service d'inscription reçoit les bonnes données
    expect(userServiceMock.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john.doe',
      password: 'password123'
    });

    // Vérifie la redirection après inscription réussie
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should reset form and submitted state on reset', () => {
    component.submitted = true;
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john.doe',
      password: 'password123'
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.value).toEqual({
      firstName: null,
      lastName: null,
      login: null,
      password: null
    });
  });
});