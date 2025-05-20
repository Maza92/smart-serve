import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResetPasswordRequest } from '@app/core/model/auth/reset-password-request';
import { AuthService } from '@app/core/service/auth.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './user-password-reset.component.html',
  styleUrls: ['./user-password-reset.component.css'],
})
export class UserPasswordResetComponent {
  passwordForm!: FormGroup;
  showPassword = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.passwordForm = this.builder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onResetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;

    const request: ResetPasswordRequest = {
      oldPassword,
      newPassword,
    };

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.toastService.success('Contraseña actualizada exitosamente');
        this.passwordForm.reset();
      },
      error: (error) => {
        this.toastService.error(
          error.message || 'Error al actualizar la contraseña'
        );
      },
    });
  }
}
