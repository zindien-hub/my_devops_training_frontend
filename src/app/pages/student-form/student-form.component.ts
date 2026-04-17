import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { StudentService } from '../../core/service/student.service';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  studentForm: FormGroup = new FormGroup({});
  submitted = false;
  loading = false;
  errorMessage = '';

  isEditMode = false;
  studentId: number | null = null;

  ngOnInit(): void {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.studentId = Number(id);
      this.loadStudent(this.studentId);
    }
  }

  get form() {
    return this.studentForm.controls;
  }

  loadStudent(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.studentService.getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (student) => {
          this.studentForm.patchValue({
            firstName: student.firstName,
            lastName: student.lastName
          });
        },
        error: (err) => {
          console.error('Erreur lors du chargement de l’étudiant :', err);
          this.errorMessage = 'Impossible de charger l’étudiant';
        }
      });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.studentForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = this.studentForm.value;

    const request$ = this.isEditMode && this.studentId
      ? this.studentService.update(this.studentId, payload)
      : this.studentService.create(payload);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (student) => {
          this.router.navigate(['/students', student.id]);
        },
        error: (err) => {
          console.error('Erreur lors de l’enregistrement :', err);
          this.errorMessage = 'Impossible d’enregistrer l’étudiant';
        }
      });
  }
}