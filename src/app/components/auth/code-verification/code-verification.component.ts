import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/service/auth.service';
import { LocalStorageService } from '@app/core/service/local-storage.service';
import { ToastService } from '@app/lib/toast/toast.service';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-code-verification',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './code-verification.component.html',
  styleUrl: './code-verification.component.css',
})
export class CodeVerificationComponent implements OnInit, OnDestroy {
  codeForm: FormGroup;
  isLoading = false;
  codeInputs: FormGroup[] = [];
  codeLength = 6;

  private timerSubscription: Subscription | null = null;
  minutes = 10;
  seconds = 0;
  isExpired = false;

  resendDisabled = false;
  resendCountdown = 60;
  private resendSubscription: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    const codeControls: any = {};

    for (let i = 0; i < this.codeLength; i++) {
      codeControls[`digit${i}`] = [
        '',
        [Validators.required, Validators.pattern('^[0-9]$')],
      ];
    }

    this.codeForm = this.fb.group(codeControls);

    this.codeForm.addControl(
      'code',
      this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
      ])
    );

    for (let i = 0; i < this.codeLength; i++) {
      this.codeForm.get(`digit${i}`)?.valueChanges.subscribe((value) => {
        this.updateCodeValue();
      });
    }
  }

  ngOnInit(): void {
    const recoveryEmail = this.localStorageService.get('recovery_email');

    if (!recoveryEmail) {
      this.toastService.show({
        message: 'No se encontró el correo de recuperación.',
        duration: 3000,
        position: 'top-center',
      });

      this.router.navigate(['/auth/email-verification']);
      return;
    }

    this.startTimer();

    setTimeout(() => {
      const firstInput = document.getElementById('code-input-0');
      if (firstInput) {
        (firstInput as HTMLInputElement).focus();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.resendSubscription) {
      this.resendSubscription.unsubscribe();
    }
  }

  get code() {
    return this.codeForm.get('code');
  }

  updateCodeValue(): void {
    let codeValue = '';
    for (let i = 0; i < this.codeLength; i++) {
      codeValue += this.codeForm.get(`digit${i}`)?.value || '';
    }
    this.codeForm.get('code')?.setValue(codeValue, { emitEvent: false });
  }

  handlePaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text').trim();
    if (pastedText.length === this.codeLength && /^\d+$/.test(pastedText)) {
      for (let i = 0; i < this.codeLength; i++) {
        this.codeForm.get(`digit${i}`)?.setValue(pastedText[i]);
      }
      const lastInput = document.getElementById(
        `code-input-${this.codeLength - 1}`
      );
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
    }
  }

  onDigitInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (/^\d$/.test(value)) {
      if (index < this.codeLength - 1) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) {
          (nextInput as HTMLInputElement).focus();
        }
      }
    } else {
      this.codeForm.get(`digit${index}`)?.setValue('', { emitEvent: true });
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const currentInput = event.target as HTMLInputElement;
      if (currentInput.value === '' && index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
        }
      }
    }
  }

  startTimer(): void {
    const timer$ = interval(1000);
    this.timerSubscription = timer$.subscribe(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else if (this.minutes > 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.isExpired = true;
        if (this.timerSubscription) {
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }

  startResendCountdown(): void {
    this.resendDisabled = true;
    this.resendCountdown = 60;

    const resendTimer$ = interval(1000);
    this.resendSubscription = resendTimer$.subscribe(() => {
      if (this.resendCountdown > 0) {
        this.resendCountdown--;
      } else {
        this.resendDisabled = false;
        if (this.resendSubscription) {
          this.resendSubscription.unsubscribe();
        }
      }
    });
  }

  resendCode(): void {
    if (this.resendDisabled) {
      return;
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.minutes = 10;
    this.seconds = 0;
    this.isExpired = false;
    this.startTimer();

    this.startResendCountdown();

    const recoveryEmail: string | null =
      this.localStorageService.get('recovery_email');

    if (!recoveryEmail || recoveryEmail === '') {
      this.resendCodeAlert();
    }

    this.authService.forgotPassword({ email: recoveryEmail || '' }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(
          'Se ha enviado un correo de recuperación de contraseña',
          'Correo enviado'
        );
        this.localStorageService.set('recovery_email', recoveryEmail);
      },
      error: (err) => {
        this.toastService.error(err.message, 'Error');
      },
    });
  }

  onSubmit(): void {
    this.updateCodeValue();

    if (this.codeForm.invalid || this.isExpired) {
      return;
    }

    this.isLoading = true;
    const verificationCode = this.code?.value;
    const recoveryEmail: string | null =
      this.localStorageService.get('recovery_email');

    if (!recoveryEmail) {
      this.resendCodeAlert();
    }

    this.authService
      .verifyResetCode({ email: recoveryEmail || '', code: verificationCode })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toastService.success(
            'Código de verificación correcto',
            'Verificación exitosa'
          );
          this.localStorageService.set('reset_token', res.resetToken);
          this.localStorageService.set('code_verified', true);
          this.router.navigate(['/auth/reset-password']);
        },
        error: (err) => {
          this.toastService.error(err.message, 'Error');
          this.isLoading = false;
          this.router.navigate(['/auth/email-verification']);
        },
      });
  }

  resendCodeAlert(): void {
    this.toastService.error(
      'No se encontró el correo de recuperación.',
      'Error'
    );
    this.router.navigate(['/auth/email-verification']);
    return;
  }
}
