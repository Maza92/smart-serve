import { Component } from '@angular/core';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ModalService } from 'ngx-modal-ease';
import { OptionSelectComponent } from './option-select/option-select.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movement',
  standalone: true,
  imports: [BasePageComponent, LucideAngularModule],
  templateUrl: './movement.component.html',
  styleUrl: './movement.component.css',
})
export class MovementComponent {
  constructor(private modalService: ModalService, private router: Router) {}

  openOptionSelectModal() {
    this.modalService.open(OptionSelectComponent, {
      modal: {
        enter: 'enter-going-up 0.1s ease-out',
        leave: 'leave-going-down 0.1s ease-out',
        top: '50%',
        left: '50%',
      },
      overlay: {
        enter: 'fade-in 0.3s ease-out',
        leave: 'fade-out 0.2s ease-in',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },

      size: {
        width: '100%',
        height: '334px',
        padding: '0px 0.5rem',
      },
      actions: {
        escape: true,
        click: true,
      },
    });
  }
}
