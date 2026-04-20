import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { StudentService } from './student.service';
import { Student } from '../models/Student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il ne reste pas de requête HTTP non traitée
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /api/students', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'Tom', lastName: 'Sawyer' }
    ];

    service.getAll().subscribe(response => {
      expect(response).toEqual(mockStudents);
    });

    // Intercepte la requête HTTP attendue
    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');

    // Simule la réponse du backend
    req.flush(mockStudents);
  });

  it('should call GET /api/students/{id}', () => {
    const mockStudent: Student = {
      id: 1,
      firstName: 'Tom',
      lastName: 'Sawyer'
    };

    service.getById(1).subscribe(response => {
      expect(response).toEqual(mockStudent);
    });

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('GET');

    req.flush(mockStudent);
  });

  it('should call POST /api/students', () => {
    const student: Student = {
      firstName: 'Tom',
      lastName: 'Sawyer'
    };

    const mockResponse: Student = {
      id: 1,
      firstName: 'Tom',
      lastName: 'Sawyer'
    };

    service.create(student).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');

    // Vérifie que seul le body attendu est envoyé au backend
    expect(req.request.body).toEqual({
      firstName: 'Tom',
      lastName: 'Sawyer'
    });

    req.flush(mockResponse);
  });

  it('should call PUT /api/students/{id}', () => {
    const student: Student = {
      firstName: 'Tom-Updated',
      lastName: 'Sawyer-Updated'
    };

    const mockResponse: Student = {
      id: 1,
      firstName: 'Tom-Updated',
      lastName: 'Sawyer-Updated'
    };

    service.update(1, student).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({
      firstName: 'Tom-Updated',
      lastName: 'Sawyer-Updated'
    });

    req.flush(mockResponse);
  });

  it('should call DELETE /api/students/{id}', () => {
    service.delete(1).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});