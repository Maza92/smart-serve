import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.builder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Successful login:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error && error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Login error. Please try again.';
        }
        console.error('Login error:', error);
      },
    });
  }
}
