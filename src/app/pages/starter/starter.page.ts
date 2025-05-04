import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './starter.page.html',
  styleUrl: './starter.page.css',
})
export class StarterComponent {}
