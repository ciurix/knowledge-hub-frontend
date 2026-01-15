
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { AppComponent } from './src/app.component';
import { LoginComponent } from './src/components/login/login.component';
import { HomeComponent } from './src/components/home/home.component';
import { DashboardComponent } from './src/components/dashboard/dashboard.component';
import { EditorComponent } from './src/components/editor/editor.component';
import { AdminComponent } from './src/components/admin/admin.component';
import { TutorialDetailComponent } from './src/components/tutorial-detail/tutorial-detail.component';
import { ProfileComponent } from './src/components/profile/profile.component';

const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'editor', component: EditorComponent },
  { path: 'editor/:id', component: EditorComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'tutorial/:id', component: TutorialDetailComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
