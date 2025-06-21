import { Component, Input, TemplateRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { NavigationService } from '@app/core/service/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-bar',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './back-bar.component.html',
  styles: ``,
  standalone: true,
})
export class BackBarComponent {
  @Input() title: string = '';
  @Input() actionTemplate: TemplateRef<any> | null = null;
  @Input() textColor: string = '';

  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  goBack() {
    const currentUrl = this.router.url;
    const parentPath = this.navigationService.getParentPath(currentUrl);

    if (parentPath) {
      this.router.navigate([parentPath]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  hasAction(): boolean {
    return !!this.actionTemplate;
  }
}
