import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/core/model/data/user';
import { RoleEnum, RoleLabels } from '@app/core/model/filter-options';
import { UserService } from '@app/core/service/user.service';
import { AuthService } from '@app/core/service/auth.service';
import { AlertService } from '@app/lib/alert/alert.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BackBarComponent,
    LucideAngularModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  userUpdateForm!: FormGroup;
  passwordForm!: FormGroup;
  error: string | null = null;
  id: number | null = null;
  activeTab = 1;
  roleEnumKeys = Object.values(RoleEnum);
  roleLabels = RoleLabels;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.userUpdateForm = this.builder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      firstName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required]],
      profileImagePath: [''],
      active: [false],
      roleName: ['', Validators.required],
    });

    this.passwordForm = this.builder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (!this.id) {
      this.error = 'User ID is required';
      return;
    }

    this.loadUserData(this.id);
  }

  loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        const user: User = response.data;
        console.log('User data loaded:', user);
        this.patchValue(user);
      },
      error: (error) => {
        this.error = error.message;
        console.error('Error loading user data:', error);
        this.userUpdateForm.reset();
      },
    });

    this.passwordForm = this.builder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onResetPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;

    this.authService
      .resetPassword({ currentPassword: oldPassword, newPassword })
      .subscribe({
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

  onSubmit(): void {
    if (this.userUpdateForm.invalid) {
      this.userUpdateForm.markAllAsTouched();
      return;
    }

    if (!this.id) {
      this.error = 'User ID is required';
      return;
    }

    const userData = this.userUpdateForm.value;

    this.userService
      .updateUser(this.id, { id: this.id, ...userData })
      .subscribe({
        next: (response) => {
          const user: User = response.data;
          this.patchValue(user);
          this.toastService.success(response.message, 'Exito', {
            position: 'top-center',
            duration: 1000,
            showCloseButton: false,
            showProgressBar: true,
          });
        },
        error: (error) => {
          this.error = error.message;
          this.toastService.error(error.message, 'Error', {
            position: 'top-center',
            duration: 1000,
            showCloseButton: false,
            showProgressBar: true,
          });
        },
      });

    this.passwordForm = this.builder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  patchValue(user: User): void {
    this.userUpdateForm.patchValue({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      profileImagePath: user.profileImagePath,
      active: user.active,
      roleName: user.roleName,
    });

    this.passwordForm = this.builder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.userUpdateForm.get('username');
  }

  get firstName() {
    return this.userUpdateForm.get('firstName');
  }

  get lastName() {
    return this.userUpdateForm.get('lastName');
  }

  get email() {
    return this.userUpdateForm.get('email');
  }

  get phone() {
    return this.userUpdateForm.get('phone');
  }

  get profileImagePath() {
    return this.userUpdateForm.get('profileImagePath');
  }

  get active() {
    return this.userUpdateForm.get('active');
  }

  get roleName() {
    return this.userUpdateForm.get('roleName');
  }
}
