import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../core/service/student.service';

describe('StudentFormComponent', () => {
  describe('en mode création', () => {
    let component: StudentFormComponent;
    let fixture: ComponentFixture<StudentFormComponent>;

    let studentServiceMock: {
      getById: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };

    let router: Router;

    beforeEach(async () => {
      // Faux service étudiant pour contrôler les appels create/update/getById
      studentServiceMock = {
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      };

      await TestBed.configureTestingModule({
        imports: [StudentFormComponent],
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

      router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);

      fixture = TestBed.createComponent(StudentFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize empty form in create mode', () => {
      expect(component.isEditMode).toBe(false);
      expect(component.studentId).toBeNull();
      expect(component.studentForm.value).toEqual({
        firstName: '',
        lastName: ''
      });
    });

    it('should have invalid form when fields are empty', () => {
      component.studentForm.setValue({
        firstName: '',
        lastName: ''
      });

      expect(component.studentForm.invalid).toBe(true);
    });

    it('should call create and navigate to student detail on success', () => {
      const mockCreatedStudent = {
        id: 1,
        firstName: 'Tom',
        lastName: 'Sawyer'
      };

      // Le mock doit renvoyer un Observable
      studentServiceMock.create.mockReturnValue(of(mockCreatedStudent));

      component.studentForm.setValue({
        firstName: 'Tom',
        lastName: 'Sawyer'
      });

      component.onSubmit();

      // Vérifie que la création est appelée avec les données du formulaire
      expect(studentServiceMock.create).toHaveBeenCalledWith({
        firstName: 'Tom',
        lastName: 'Sawyer'
      });

      // Vérifie la redirection vers le détail après création
      expect(router.navigate).toHaveBeenCalledWith(['/students', 1]);
    });
  });

  describe('en mode édition', () => {
    let component: StudentFormComponent;
    let fixture: ComponentFixture<StudentFormComponent>;

    let studentServiceMock: {
      getById: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };

    let router: Router;

    beforeEach(async () => {
      studentServiceMock = {
        getById: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
      };

      // En mode édition, ngOnInit appelle loadStudent()
      studentServiceMock.getById.mockReturnValue(
        of({
          id: 1,
          firstName: 'Tom',
          lastName: 'Sawyer'
        })
      );

      await TestBed.configureTestingModule({
        imports: [StudentFormComponent],
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

      router = TestBed.inject(Router);
      jest.spyOn(router, 'navigate').mockResolvedValue(true);

      fixture = TestBed.createComponent(StudentFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize edit mode and load student', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.studentId).toBe(1);

      // Vérifie que le détail étudiant est chargé pour pré-remplir le formulaire
      expect(studentServiceMock.getById).toHaveBeenCalledWith(1);
      expect(component.studentForm.value).toEqual({
        firstName: 'Tom',
        lastName: 'Sawyer'
      });
    });

    it('should call update and navigate to student detail on success', () => {
      const mockUpdatedStudent = {
        id: 1,
        firstName: 'Tom-Updated',
        lastName: 'Sawyer-Updated'
      };

      // Le mock doit renvoyer un Observable
      studentServiceMock.update.mockReturnValue(of(mockUpdatedStudent));

      component.studentForm.setValue({
        firstName: 'Tom-Updated',
        lastName: 'Sawyer-Updated'
      });

      component.onSubmit();

      // Vérifie que la mise à jour est appelée avec l'id et les nouvelles valeurs
      expect(studentServiceMock.update).toHaveBeenCalledWith(1, {
        firstName: 'Tom-Updated',
        lastName: 'Sawyer-Updated'
      });

      // Vérifie la redirection vers le détail après modification
      expect(router.navigate).toHaveBeenCalledWith(['/students', 1]);
    });
  });
});