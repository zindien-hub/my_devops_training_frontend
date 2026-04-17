import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-students-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './students-list.component.html'
})
export class StudentsListComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);

  students: Student[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des étudiants:', err);
          this.errorMessage = 'Impossible de charger les étudiants';
          this.loading = false;
        }
      });
  }

  deleteStudent(id: number | undefined): void {
    if (!id) {
      return;
    }

    const confirmed = confirm('Supprimer cet étudiant ?');
    if (!confirmed) {
      return;
    }

    this.studentService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.errorMessage = 'Impossible de supprimer cet étudiant';
        }
      });
  }
}