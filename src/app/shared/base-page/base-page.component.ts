import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { BackBarComponent } from '../back-bar/back-bar.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-base-page',
  imports: [BackBarComponent, CommonModule, LucideAngularModule],
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.css',
})
export class BasePageComponent {
  @Input() title: string = '';
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() headerTextColor: string = 'text-on-background';
  @Input() scrollContainerClass: string = '';
  @Input() backgroundColor: string = 'bg-outline';

  @ContentChild('header', { read: TemplateRef })
  headerTemplate?: TemplateRef<any>;
}
