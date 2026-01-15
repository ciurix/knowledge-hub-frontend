import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';

// Backend is running on localhost:3001
const API_URL = 'http://localhost:3001/api/auth';

export interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(!!localStorage.getItem('auth_token'));

  constructor() {}

  login(credentials: any) {
    return this.http.post<any>(`${API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          this.setSession(response);
        }
      })
    );
  }

  register(data: any) {
    // Backend returns just the user on register, so we might need to login automatically or redirect to login
    return this.http.post<any>(`${API_URL}/register`, data);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  private setSession(authResult: any) {
    localStorage.setItem('auth_token', authResult.token);
    // authResult.user matches the backend response { token, user: {...} }
    localStorage.setItem('user_data', JSON.stringify(authResult.user));
    this.currentUser.set(authResult.user);
    this.isAuthenticated.set(true);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user_data');
    return userStr ? JSON.parse(userStr) : null;
  }
}
