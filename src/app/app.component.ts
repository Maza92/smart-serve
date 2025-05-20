import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'smart-serve';
  constructor() {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack || window.history.length > 1) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });
  }
}
