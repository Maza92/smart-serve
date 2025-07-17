import { Routes } from '@angular/router';
import { PrivacyComponent } from '@app/components/legal/privacy/privacy.component';
import { TermsComponent } from '@app/components/legal/terms/terms.component';

export const privRoutes: Routes = [
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
];
