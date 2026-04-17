import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.httpClient.get<Student[]>('/api/students');
  }

  getById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(`/api/students/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.httpClient.post<Student>('/api/students', {
      firstName: student.firstName,
      lastName: student.lastName
    });
  }

  update(id: number, student: Student): Observable<Student> {
    return this.httpClient.put<Student>(`/api/students/${id}`, {
      firstName: student.firstName,
      lastName: student.lastName
    });
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`/api/students/${id}`);
  }
}