import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NavigationService } from '@app/core/service/navigation.service';
import { ReportService } from '@app/core/service/report.service';
import { ReportDashboard } from '@app/core/model/data/report-dashboard';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { UiChartComponent } from '@app/shared/ui-chart/ui-chart.component';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { format } from 'date-fns';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GoToDirective } from '@app/shared/directives/go-to.directive';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgApexchartsModule,
    BasePageComponent,
    UiChartComponent,
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
    GoToDirective,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css',
})
export class ReportComponent implements OnInit {
  dateRangeForm: FormGroup;
  dashboardData: ReportDashboard | null = null;
  isLoading = false;

  private defaultStartDate = new Date();
  private defaultEndDate = new Date();

  constructor(
    private navigationService: NavigationService,
    private reportService: ReportService,
    private fb: FormBuilder
  ) {
    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 7);

    this.dateRangeForm = this.fb.group({
      startDate: [format(this.defaultStartDate, 'yyyy-MM-dd')],
      endDate: [format(this.defaultEndDate, 'yyyy-MM-dd')],
    });
  }

  ngOnInit(): void {
    this.navigationService.configureNavbar(['home', 'settings']);
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;

    if (startDate && endDate) {
      this.reportService.getDashboard(startDate, endDate).subscribe({
        next: (response) => {
          console.log('Dashboard data received:', response.data);
          this.dashboardData = response.data;
          this.updateCharts();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.isLoading = false;
        },
      });
    }
  }

  updateCharts(): void {
    if (this.dashboardData) {
      this.updateSalesChart();
      this.updateDishChart();
      this.updatePaymentChart();
    }
  }

  updateSalesChart(): void {
    if (this.dashboardData?.salesOverview) {
      this.salesChartOptions = {
        series: [
          {
            name: 'Sales',
            data: this.dashboardData.salesOverview.values,
          },
        ],
        chart: {
          type: 'line',
          height: 250,
        },
        xaxis: {
          categories: this.dashboardData.salesOverview.labels,
        },
        yaxis: {
          labels: {
            formatter: (val) => `$${val}`,
          },
        },
        fill: {
          colors: ['#1A73E8', '#B32824'],
          opacity: 1,
        },
        stroke: {
          curve: 'smooth',
          width: 3,
        },
        markers: {
          size: 5,
        },
      };
    }
  }

  updateDishChart(): void {
    if (this.dashboardData?.dishPerformance) {
      this.dishChartOptions = {
        series: [
          {
            name: 'Orders',
            data: this.dashboardData.dishPerformance.quantities,
          },
        ],
        chart: {
          type: 'bar',
          height: 300,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 5,
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'all',
            barHeight: '60%',
          },
        },
        xaxis: {
          categories: this.dashboardData.dishPerformance.dishNames,
        },
        stroke: {
          show: false,
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} orders`,
          },
        },
        colors: ['#c67c4e'],
      };
    }
  }

  updatePaymentChart(): void {
    if (this.dashboardData?.paymentMethodDistribution) {
      if (
        this.dashboardData.paymentMethodDistribution.paymentMethods.length > 0
      ) {
        this.paymentChartOptions = {
          series: this.dashboardData.paymentMethodDistribution.percentages,
          chart: {
            type: 'donut',
            height: 300,
          },
          labels: this.dashboardData.paymentMethodDistribution.paymentMethods,
          colors: ['#c67c4e', '#90705e', '#7b7949', '#81746e'],
          stroke: {
            show: false,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%',
              },
            },
          },
        };
      } else {
        this.paymentChartOptions = {
          series: [100],
          chart: {
            type: 'donut',
            height: 300,
          },
          labels: ['No hay datos de métodos de pago'],
          colors: ['#E0E0E0'],
          stroke: {
            show: false,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '60%',
              },
            },
          },
        };
      }
    }
  }

  public salesChartOptions: Partial<ApexOptions> = {
    series: [{ name: 'Sales', data: [] }],
    chart: { type: 'line', height: 250 },
    xaxis: { categories: [] },
  };

  public dishChartOptions: Partial<ApexOptions> = {
    series: [{ name: 'Orders', data: [] }],
    chart: { type: 'bar', height: 300 },
    xaxis: { categories: [] },
  };

  public paymentChartOptions: Partial<ApexOptions> = {
    series: [],
    chart: { type: 'donut', height: 300 },
    labels: [],
  };

  onDateRangeChange(): void {
    this.loadDashboardData();
  }
}
