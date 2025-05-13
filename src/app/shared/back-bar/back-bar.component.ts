import { Component, Input, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

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

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  hasAction(): boolean {
    return !!this.actionTemplate;
  }
}
