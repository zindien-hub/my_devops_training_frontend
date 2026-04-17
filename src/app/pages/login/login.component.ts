import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule],
  templateUrl: './login.component.html',
  standalone: true,
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.userService.login(this.loginForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/students']);
        },
        error: (err) => {
          console.error('Erreur de connexion:', err);
          this.errorMessage = err.error?.message || 'Erreur lors de la connexion';
        }
      });
  }
}