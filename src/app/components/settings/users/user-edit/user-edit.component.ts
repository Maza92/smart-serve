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
import { AdminPasswordResetComponent } from './admin-password-reset/admin-password-reset.component';
import { UserPasswordResetComponent } from './user-password-reset/user-password-reset.component';
import { LocalStorageService } from '@app/core/service/local-storage.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BackBarComponent,
    LucideAngularModule,
    AdminPasswordResetComponent,
    UserPasswordResetComponent,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  userUpdateForm!: FormGroup;
  id: number | null = null;
  activeTab = 1;
  roleEnumKeys = Object.values(RoleEnum);
  roleLabels = RoleLabels;
  showPassword = false;
  isAdminMode = true;

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private localStorageService: LocalStorageService
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
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (!this.id) {
      this.id = this.localStorageService.get('user_id');
    }

    if (!this.id) {
      this.toastService.error('User ID is required', 'Error');
      return;
    }

    const currentUrl = this.router.url;
    this.isAdminMode = currentUrl.includes('/settings/users/');

    this.loadUserData(this.id);
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loadUserData(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        const user: User = response.data;
        console.log('User data loaded:', user);
        this.patchValue(user);
      },
      error: (error) => {
        this.toastService.error('Error loading user data:', error.message);
        this.userUpdateForm.reset();
      },
    });
  }

  onSubmit(): void {
    if (this.userUpdateForm.invalid) {
      this.userUpdateForm.markAllAsTouched();
      return;
    }

    if (!this.id) {
      this.toastService.error('User ID is required', 'Error');
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
          this.toastService.error(error.message, 'Error');
        },
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
