import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResetPasswordByAdminRequest } from '@app/core/model/auth/reset-password-by-admin-request';
import { AuthService } from '@app/core/service/auth.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LucideAngularModule],
  templateUrl: './admin-password-reset.component.html',
  styleUrls: ['./admin-password-reset.component.css'],
})
export class AdminPasswordResetComponent {
  @Input() userId!: number;
  passwordForm!: FormGroup;
  showPassword = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.passwordForm = this.builder.group({
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

    const { newPassword } = this.passwordForm.value;

    const request: ResetPasswordByAdminRequest = {
      newPassword,
    };

    this.authService.resetPasswordByAdmin(request, this.userId).subscribe({
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
