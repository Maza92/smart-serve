import { Component, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.css',
})
export class PosComponent implements OnInit, OnDestroy {
  currentDate: string = '';
  currentTime: string = '';
  private intervalId: any;

  constructor() {
    this.updateDateTime();
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateDateTime() {
    const now = new Date();
    this.currentDate = formatDate(now, 'EEEE, d MMMM, y', 'es-ES');
    this.currentTime = now.toLocaleTimeString('es-ES', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }
}
