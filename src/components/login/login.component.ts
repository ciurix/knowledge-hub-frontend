import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoginMode = signal(true);
  errorMsg = signal('');
  isLoading = signal(false);

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode(isLogin: boolean) {
    this.isLoginMode.set(isLogin);
    this.errorMsg.set('');
    this.authForm.reset();
  }

  async onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');

    const formVal = this.authForm.value;

    try {
      if (this.isLoginMode()) {
        this.authService.login(formVal).subscribe({
          next: () => {
             this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.errorMsg.set(err.error?.message || 'Login failed');
            this.isLoading.set(false);
          }
        });
      } else {
        // Register flow
        this.authService.register(formVal).subscribe({
          next: () => {
            // After register, immediately login
            this.authService.login(formVal).subscribe({
               next: () => this.router.navigate(['/dashboard']),
               error: () => {
                 // If auto-login fails, switch to login tab
                 this.toggleMode(true);
                 this.isLoading.set(false);
                 this.errorMsg.set('Registration successful. Please log in.');
               }
            });
          },
          error: (err) => {
             this.errorMsg.set(err.error?.message || 'Registration failed');
             this.isLoading.set(false);
          }
        });
      }
    } catch (e) {
      this.isLoading.set(false);
      this.errorMsg.set('An unexpected error occurred');
    }
  }
}
