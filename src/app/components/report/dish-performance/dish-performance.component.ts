import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '@app/core/service/report.service';
import { DishPerformance } from '@app/core/model/data/report-dashboard';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { UiChartComponent } from '@app/shared/ui-chart/ui-chart.component';
import { ApexOptions } from 'ng-apexcharts';
import { format } from 'date-fns';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NavigationService } from '@app/core/service/navigation.service';

@Component({
  selector: 'app-dish-performance',
  standalone: true,
  imports: [
    BasePageComponent,
    UiChartComponent,
    ReactiveFormsModule,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './dish-performance.component.html',
  styleUrl: './dish-performance.component.css',
})
export class DishPerformanceComponent implements OnInit {
  dateRangeForm: FormGroup;
  dishPerformanceData: DishPerformance | null = null;
  isLoading = false;

  private defaultStartDate = new Date();
  private defaultEndDate = new Date();

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder,
    private navigationService: NavigationService
  ) {
    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 7);

    this.dateRangeForm = this.fb.group({
      startDate: [format(this.defaultStartDate, 'yyyy-MM-dd')],
      endDate: [format(this.defaultEndDate, 'yyyy-MM-dd')],
    });
  }

  ngOnInit(): void {
    this.loadDishPerformanceData();
    this.navigationService.configureNavbar(['home', 'report']);
  }

  loadDishPerformanceData(): void {
    this.isLoading = true;
    const startDate = this.dateRangeForm.get('startDate')?.value;
    const endDate = this.dateRangeForm.get('endDate')?.value;

    if (startDate && endDate) {
      this.reportService
        .getDishPerformance(startDate, endDate, 1000)
        .subscribe({
          next: (response) => {
            console.log('Dish performance data received:', response.data);
            this.dishPerformanceData = response.data;
            this.updateDishChart();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading dish performance data:', error);
            this.isLoading = false;
          },
        });
    }
  }

  updateDishChart(): void {
    if (this.dishPerformanceData) {
      this.dishChartOptions = {
        series: [
          {
            name: 'Pedidos',
            data: this.dishPerformanceData.quantities,
          },
        ],
        chart: {
          type: 'bar',
          height: Math.max(400, this.dishPerformanceData.dishNames.length * 40),
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true,
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 8,
            borderRadiusApplication: 'end',
            borderRadiusWhenStacked: 'all',
            barHeight: '70%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val}`,
          offsetX: 10,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            colors: ['#fff'],
          },
        },
        xaxis: {
          categories: this.dishPerformanceData.dishNames,
          title: {
            text: 'Cantidad de Pedidos',
          },
        },
        yaxis: {
          title: {
            text: 'Platillos',
          },
        },
        stroke: {
          show: false,
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} pedidos`,
          },
          theme: 'dark',
        },
        colors: ['#c67c4e'],
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
      };
    }
  }

  public dishChartOptions: Partial<ApexOptions> = {
    series: [{ name: 'Pedidos', data: [] }],
    chart: { type: 'bar', height: 400 },
    xaxis: { categories: [] },
  };

  onDateRangeChange(): void {
    this.loadDishPerformanceData();
  }

  getTotalOrders(): number {
    return (
      this.dishPerformanceData?.quantities.reduce((sum, qty) => sum + qty, 0) ||
      0
    );
  }

  getAverageOrders(): number {
    if (!this.dishPerformanceData?.quantities.length) return 0;
    return Math.round(
      this.getTotalOrders() / this.dishPerformanceData.quantities.length
    );
  }

  getTopDish(): string {
    if (!this.dishPerformanceData?.dishNames.length) return 'N/A';
    const maxIndex = this.dishPerformanceData.quantities.indexOf(
      Math.max(...this.dishPerformanceData.quantities)
    );
    return this.dishPerformanceData.dishNames[maxIndex];
  }
}
