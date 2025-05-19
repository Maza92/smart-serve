import { Component } from '@angular/core';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [BackBarComponent],
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css'],
})
export class PrivacyComponent {}
