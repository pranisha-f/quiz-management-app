import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { AuthGuard } from './auth.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';

// import { StudentDashboardComponent } from './student/student-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },

  // //   { path: 'student', component: StudentDashboardComponent },
  //   {
  //     path: 'student',
  //     loadComponent: () => import('./student/student-dashboard.component').then(m => m.StudentDashboardComponent),
  //     canActivate: [AuthGuard],
  //     data: { roles: ['student'] }
  //   },

  //   {
  //     path: 'student/quiz/:id',
  //     loadComponent: () => import('./student/student-quiz.component').then(m => m.StudentQuizComponent),
  //     canActivate: [AuthGuard],
  //     data: { roles: ['student'] }
  //   },
  {
    path: '**',
    redirectTo: '/login', // Default to login for undefined routes
  },

  // add lazy-loaded admin/student routes later
];
