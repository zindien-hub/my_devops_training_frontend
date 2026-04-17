import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentsListComponent } from './pages/students-list/students-list.component';
import { authGuard } from './core/guard/auth.guard';
import { StudentDetailComponent } from './pages/student-detail/student-detail.component';
import { StudentFormComponent } from './pages/student-form/student-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentsListComponent,
    canActivate: [authGuard]
  },
  {
  path: 'students/new',
  component: StudentFormComponent,
  canActivate: [authGuard]
  },
  {
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  }
];