import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

describe('StudentDetailComponent', () => {
  describe('avec un id valide dans la route', () => {
    let component: StudentDetailComponent;
    let fixture: ComponentFixture<StudentDetailComponent>;

    let studentServiceMock: {
      getById: jest.Mock;
    };

    beforeEach(async () => {
      // Faux service étudiant pour contrôler la réponse du détail
      studentServiceMock = {
        getById: jest.fn()
      };

      studentServiceMock.getById.mockReturnValue(
        of({
          id: 1,
          firstName: 'Tom',
          lastName: 'Sawyer',
          createdAt: '2026-04-19T10:00:00',
          updatedAt: '2026-04-19T10:00:00'
        })
      );

      await TestBed.configureTestingModule({
        imports: [StudentDetailComponent],
        providers: [
          provideRouter([]),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: {
                  get: jest.fn().mockReturnValue('1')
                }
              }
            }
          },
          { provide: StudentService, useValue: studentServiceMock }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(StudentDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load student on init', () => {
      // Vérifie que l'id de la route est utilisé pour charger l'étudiant
      expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
      expect(component.student).toEqual({
        id: 1,
        firstName: 'Tom',
        lastName: 'Sawyer',
        createdAt: '2026-04-19T10:00:00',
        updatedAt: '2026-04-19T10:00:00'
      });
      expect(component.loading).toBe(false);
    });

    it('should display student details in template', () => {
      fixture.detectChanges();

      // Vérifie que les informations de l'étudiant sont affichées
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Tom');
      expect(compiled.textContent).toContain('Sawyer');
      expect(compiled.textContent).toContain('1');
    });
  });

  describe('avec un id invalide dans la route', () => {
    let component: StudentDetailComponent;
    let fixture: ComponentFixture<StudentDetailComponent>;

    let studentServiceMock: {
      getById: jest.Mock;
    };

    beforeEach(async () => {
      studentServiceMock = {
        getById: jest.fn()
      };

      await TestBed.configureTestingModule({
        imports: [StudentDetailComponent],
        providers: [
          provideRouter([]),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: {
                  get: jest.fn().mockReturnValue(null)
                }
              }
            }
          },
          { provide: StudentService, useValue: studentServiceMock }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(StudentDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set error message when id is invalid', () => {
      expect(component.errorMessage).toBe('Invalid student id');
      expect(studentServiceMock.getById).not.toHaveBeenCalled();
    });
  });
});