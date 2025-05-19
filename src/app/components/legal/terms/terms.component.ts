import { Component } from '@angular/core';
import { BackBarComponent } from '@app/shared/back-bar/back-bar.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [BackBarComponent],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
})
export class TermsComponent {}
