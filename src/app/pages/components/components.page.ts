import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './components.page.html',
  styleUrl: './components.page.css',
})
export class ComponentsComponent {}
