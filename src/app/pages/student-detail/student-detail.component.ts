import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StudentService } from '../../core/service/student.service';
import { Student } from '../../core/models/Student';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-detail.component.html'
})
export class StudentDetailComponent implements OnInit {
  private studentService = inject(StudentService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  student: Student | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStudent();
  }

  loadStudent(): void {
    this.loading = true;
    this.errorMessage = '';

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid student id';
      this.loading = false;
      return;
    }

    this.studentService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (student) => {
          this.student = student;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l\'étudiant:', err);
          this.errorMessage = 'Impossible de charger l\'étudiant';
          this.loading = false;
        }
      });
  }
}