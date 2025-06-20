import { Component } from '@angular/core';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-shop-register',
  imports: [BasePageComponent, LucideAngularModule],
  templateUrl: './shop-register.component.html',
  styleUrl: './shop-register.component.css',
})
export class ShopRegisterComponent {}
