import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordRequest } from '@app/core/model/auth/forgot-password-request';
import { AuthService } from '@app/core/service/auth.service';
import { LocalStorageService } from '@app/core/service/local-storage.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    CommonModule,
    BackBarComponent,
    RouterLink,
  ],
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css'],
})
export class EmailVerificationComponent implements OnInit {
  emailForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.emailForm.get('email');
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }

    this.isLoading = true;

    const forgotPassword: ForgotPasswordRequest = {
      email: this.email?.value,
    };

    this.authService.forgotPassword(forgotPassword).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(
          'Se ha enviado un correo de recuperación de contraseña',
          'Correo enviado'
        );
        this.localStorageService.set('recovery_email', this.email?.value);
        this.router.navigate(['/auth/code-verification']);
      },
      error: (err) => {
        this.toastService.error(err.message, 'Error');
      },
    });
  }
}
