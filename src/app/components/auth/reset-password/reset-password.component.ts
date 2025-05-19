import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RecoverPasswordRequest } from '@app/core/model/auth/recover-password-request';
import { AuthService } from '@app/core/service/auth.service';
import { LocalStorageService } from '@app/core/service/local-storage.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    CommonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    const codeVerified = localStorage.getItem('code_verified');
    if (codeVerified !== 'true') {
      this.router.navigate(['/auth/email-verification']);
      return;
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      return null;
    }
  }

  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.isLoading = true;

    const newPassword = this.resetForm.get('password')?.value;
    const resetToken = this.localStorageService.get('reset_token');

    if (!resetToken) {
      this.toastService.error(
        'No se encontró el token de recuperación.',
        'Error'
      );
      this.isLoading = false;
      return;
    }

    const recover: RecoverPasswordRequest = {
      newPassword: newPassword,
      resetToken: resetToken.toString(),
    };

    this.authService.recoverPassword(recover).subscribe({
      next: (res) => {
        this.toastService.success(
          'Contraseña actualizada correctamente.',
          'Éxito'
        );
        localStorage.removeItem('recovery_email');
        localStorage.removeItem('code_verified');
        localStorage.removeItem('reset_token');
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toastService.error(err.message, 'Error');
        this.isLoading = false;
        this.router.navigate(['/auth/email-verification']);
      },
    });
  }
}
