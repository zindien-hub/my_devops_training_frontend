import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { StudentsListComponent } from './students-list.component';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

describe('StudentsListComponent', () => {
  let component: StudentsListComponent;
  let fixture: ComponentFixture<StudentsListComponent>;

  let studentServiceMock: {
    getAll: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    // Faux service étudiant pour contrôler les réponses dans les tests
    studentServiceMock = {
      getAll: jest.fn(),
      delete: jest.fn()
    };

    studentServiceMock.getAll.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [StudentsListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'Tom', lastName: 'Sawyer' }
    ];

    studentServiceMock.getAll.mockReturnValue(of(mockStudents));

    component.ngOnInit();

    // Vérifie que la liste est chargée au démarrage
    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students).toEqual(mockStudents);
    expect(component.loading).toBe(false);
  });

  it('should display students returned by the service', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'Tom', lastName: 'Sawyer' },
      { id: 2, firstName: 'Huck', lastName: 'Finn' }
    ];

    studentServiceMock.getAll.mockReturnValue(of(mockStudents));

    component.loadStudents();
    fixture.detectChanges();

    // Vérifie que les données sont bien affichées dans le template
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tom');
    expect(compiled.textContent).toContain('Sawyer');
    expect(compiled.textContent).toContain('Huck');
    expect(compiled.textContent).toContain('Finn');
  });

  it('should delete student and reload list when user confirms', () => {
    studentServiceMock.delete.mockReturnValue(of(void 0));

    const loadStudentsSpy = jest.spyOn(component, 'loadStudents').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteStudent(1);

    // Vérifie la suppression puis le rechargement de la liste
    expect(studentServiceMock.delete).toHaveBeenCalledWith(1);
    expect(loadStudentsSpy).toHaveBeenCalled();
  });

  it('should not delete student when user cancels confirmation', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteStudent(1);

    expect(studentServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete student when id is undefined', () => {
    component.deleteStudent(undefined);

    expect(studentServiceMock.delete).not.toHaveBeenCalled();
  });
});