import { Routes } from '@angular/router';
import { CodeVerificationComponent } from '@app/components/auth/code-verification/code-verification.component';
import { EmailVerificationComponent } from '@app/components/auth/email-verification/email-verification.component';
import { ResetPasswordComponent } from '@app/components/auth/reset-password/reset-password.component';
import { LoginGuard } from '@app/core/guard/login.guard';
import { LoginComponent } from '@app/pages/login/login.component';
import { RegisterComponent } from '@app/pages/register/register.component';

export const authRoutes: Routes = [
  {
    path: 'auth',
    canActivate: [LoginGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'email-verification',
        component: EmailVerificationComponent,
      },
      {
        path: 'code-verification',
        component: CodeVerificationComponent,
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
      },
    ],
  },
];
