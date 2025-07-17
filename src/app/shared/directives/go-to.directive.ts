import { Directive, HostListener, Input } from '@angular/core';
import { NavigationService } from '@app/core/service/navigation.service';

@Directive({
  selector: '[appGoTo]',
  standalone: true,
})
export class GoToDirective {
  @Input('appGoTo') key: string = '';
  @Input('appGoToSegments') segments: (string | number)[] = [];

  constructor(private navigationService: NavigationService) {}

  @HostListener('click')
  onClick() {
    if (this.key) {
      this.navigationService.goTo(this.key, this.segments);
    }
  }
}
