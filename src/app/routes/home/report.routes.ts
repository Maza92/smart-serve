import { Routes } from '@angular/router';
import { DishPerformanceComponent } from '@app/components/report/dish-performance/dish-performance.component';
import { WaiterPerformanceComponent } from '@app/components/report/waiter-performance/waiter-performance.component';
import { ReportComponent } from '@app/pages/report/report.component';

export const reportRoutes: Routes = [
  {
    path: 'report',
    children: [
      {
        path: '',
        component: ReportComponent,
      },
      {
        path: 'dish-performance',
        component: DishPerformanceComponent,
      },
      {
        path: 'waiter-performance',
        component: WaiterPerformanceComponent,
      },
    ],
  },
];
