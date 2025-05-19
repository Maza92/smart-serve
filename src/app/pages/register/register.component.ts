import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '@app/core/model/auth/register-request';
import { AuthService } from '@app/core/service/auth.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    BackBarComponent,
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.registerForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]],
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get termsAccepted() {
    return this.registerForm.get('termsAccepted');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastService.warning(
        'Alerta',
        'Complete el formulario para registrarse',
        {
          position: 'center-center',
          showCloseButton: false,
          showProgressBar: false,
        }
      );
      return;
    }

    if (this.password?.value !== this.confirmPassword?.value) {
      this.toastService.warning(
        'Alerta',
        'Las contraseñas no coinciden. Por favor, verifica.',
        {
          position: 'center-center',
          showCloseButton: false,
          showProgressBar: false,
          duration: 1500,
        }
      );
      this.clearForm();
      return;
    }

    const value: RegisterRequest = {
      email: this.email?.value!,
      password: this.password?.value!,
      userName: this.username?.value!,
      firstName: this.firstName?.value!,
      lastName: this.lastName?.value!,
    };

    this.loading = true;
    this.authService.register(value).subscribe({
      next: (res) => {
        this.loading = false;
        this.toastService.success(
          'Éxito',
          'Registro exitoso. Inicie sesión para continuar.',
          {
            position: 'center-center',
            showCloseButton: false,
            showProgressBar: false,
            duration: 1500,
          }
        );
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        this.toastService.error('Error', err.message, {
          position: 'center-center',
          showCloseButton: false,
          showProgressBar: false,
          duration: 1500,
        });
      },
    });
  }

  clearForm() {
    this.registerForm.reset();
  }
}
