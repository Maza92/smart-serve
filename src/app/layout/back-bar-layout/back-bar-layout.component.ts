import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackBarComponent } from '../../shared/back-bar/back-bar.component';

@Component({
  selector: 'app-back-bar-layout',
  imports: [RouterOutlet, BackBarComponent],
  templateUrl: './back-bar-layout.component.html',
  styles: ``,
})
export class BackBarLayoutComponent {}
