import { CommonModule, NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { LucideAngularComponent, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-swipe-button',
  imports: [CommonModule, NgStyle, LucideAngularModule],
  templateUrl: './swipe-button.component.html',
  styleUrl: './swipe-button.component.css',
})
export class SwipeButtonComponent {
  @Input() buttonText: string = 'Deslizar para confirmar';
  @Input() completionThreshold: number = 0.85;
  @Input() velocityThreshold: number = 0.3;
  @Input() disabled: boolean = false;
  @Output() swipeEnd = new EventEmitter<void>();
  @Output() swipeProgress = new EventEmitter<number>();
  @Output() swipeComplete = new EventEmitter<void>();

  @ViewChild('swipeContainer') swipeContainer!: ElementRef;
  @ViewChild('sliderHandle') sliderHandle!: ElementRef;

  isSwiping: boolean = false;
  sliderPosition: number = 0;
  initialX: number = 0;
  lastMoveTime: number = 0;
  lastMoveX: number = 0;

  containerWidth: number = 0;
  handleWidth: number = 0;
  animationFrameId: number | null = null;
  isCompleted: boolean = false;
  isProcessing: boolean = false;
  hasFailed: boolean = false;

  onSwipeStart(event: MouseEvent | TouchEvent): void {
    if (this.disabled || this.isCompleted) return;

    event.preventDefault();
    this.isSwiping = true;
    this.containerWidth = this.swipeContainer.nativeElement.offsetWidth;
    this.handleWidth = this.sliderHandle.nativeElement.offsetWidth;
    this.initialX = this.getClientX(event);
    this.lastMoveTime = Date.now();
    this.lastMoveX = this.initialX;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onSwipeMove(event: MouseEvent | TouchEvent): void {
    if (!this.isSwiping || this.disabled || this.isCompleted) return;

    const currentX = this.getClientX(event);
    const diffX = currentX - this.initialX;

    this.lastMoveTime = Date.now();
    this.lastMoveX = currentX;

    this.animationFrameId = requestAnimationFrame(() => {
      const maxPosition = this.containerWidth - this.handleWidth;
      const newPosition = Math.max(0, Math.min(diffX, maxPosition));
      this.sliderPosition = newPosition;

      const progress = newPosition / maxPosition;
      this.swipeProgress.emit(progress);
    });
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onSwipeEnd(): void {
    if (
      !this.isSwiping ||
      this.disabled ||
      this.isCompleted ||
      this.isProcessing
    )
      return;

    this.isSwiping = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastMoveTime;
    const distanceDiff = this.lastMoveX - this.initialX;
    const velocity = timeDiff > 0 ? Math.abs(distanceDiff) / timeDiff : 0;

    const maxPosition = this.containerWidth - this.handleWidth;
    const progress = this.sliderPosition / maxPosition;
    const thresholdReached = progress >= this.completionThreshold;
    const fastSwipe = velocity >= this.velocityThreshold && progress > 0.3;

    if (thresholdReached || fastSwipe) {
      this.completeSwipe();
    } else {
      this.resetWithAnimation();
    }
  }

  private completeSwipe(): void {
    this.isProcessing = true;
    this.hasFailed = false;
    const maxPosition = this.containerWidth - this.handleWidth;

    this.animateToPosition(maxPosition, () => {
      this.swipeComplete.emit();
      this.swipeProgress.emit(1);
    });
  }

  private resetWithAnimation(): void {
    this.animateToPosition(0, () => {
      this.swipeProgress.emit(0);
    });
  }

  private animateToPosition(
    targetPosition: number,
    callback?: () => void
  ): void {
    const startPosition = this.sliderPosition;
    const distance = targetPosition - startPosition;
    const duration = 300;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      this.sliderPosition = startPosition + distance * easeOut;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.sliderPosition = targetPosition;
        if (callback) callback();
      }
    };

    requestAnimationFrame(animate);
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent
      ? event.clientX
      : event.touches[0].clientX;
  }

  public reset(): void {
    this.sliderPosition = 0;
    this.isCompleted = false;
    this.swipeProgress.emit(0);
    this.hasFailed = false;
    this.swipeProgress.emit(0);
  }

  public complete(): void {
    if (!this.disabled && !this.isCompleted && !this.isProcessing) {
      this.completeSwipe();
    }
  }

  public markAsSuccess(): void {
    this.isProcessing = false;
    this.isCompleted = true;
    this.hasFailed = false;
    this.swipeEnd.emit();
  }

  public markAsFailure(resetDelay: number = 1500): void {
    this.isProcessing = false;
    this.hasFailed = true;

    setTimeout(() => {
      this.resetWithAnimation();
      this.hasFailed = false;
    }, resetDelay);
  }

  get containerClasses(): string {
    const baseClasses =
      'relative flex items-center h-14 w-full max-w-xs mx-auto rounded-full border overflow-hidden select-none transition-all duration-200';
    if (this.disabled) {
      return `${baseClasses} bg-gray-100 border-gray-200 cursor-not-allowed opacity-50`;
    } else if (this.hasFailed) {
      return `${baseClasses} bg-error border-error-container cursor-default`;
    } else if (this.isCompleted) {
      return `${baseClasses} bg-tertiary border-tertiary-container cursor-default`;
    } else if (this.isProcessing) {
      return `${baseClasses} bg-gray-100 border-gray-400 cursor-default`;
    } else {
      return `${baseClasses} bg-white border-gray-300 cursor-grab active:cursor-grabbing`;
    }
  }

  get handleClasses(): string {
    const baseClasses =
      'absolute top-0 left-0 h-full w-14 rounded-full flex items-center justify-center z-10 shadow-lg transition-all duration-200';

    if (this.hasFailed) {
      return `${baseClasses} bg-error-container`;
    } else if (this.isCompleted) {
      return `${baseClasses} bg-on-tertiary`;
    } else if (this.isProcessing) {
      return `${baseClasses} bg-secondary-key`;
    } else {
      return `${baseClasses} bg-primary-key`;
    }
  }

  get textClasses(): string {
    const baseClasses =
      'absolute inset-0 flex items-center justify-center font-semibold z-0 transition-all duration-200';
    if (this.disabled) {
      return `${baseClasses} text-gray-400`;
    } else if (this.hasFailed) {
      return `${baseClasses} text-on-error`;
    } else if (this.isCompleted) {
      return `${baseClasses} text-on-tertiary`;
    } else if (this.isProcessing) {
      return `${baseClasses} text-primary-key`;
    } else {
      return `${baseClasses} text-gray-600`;
    }
  }

  get displayText(): string {
    if (this.hasFailed) return '¡Error! Intenta de nuevo';
    if (this.isCompleted) return '¡Completado!';
    if (this.isProcessing) return 'Procesando...';
    return this.buttonText;
  }
}
