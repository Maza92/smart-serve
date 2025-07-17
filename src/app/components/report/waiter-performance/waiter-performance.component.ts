import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BasePageComponent } from '@app/shared/base-page/base-page.component';
import { LucideAngularModule } from 'lucide-angular';
import { ReportService } from '@app/core/service/report.service';
import { NavigationService } from '@app/core/service/navigation.service';
import { Paged } from '@app/core/model/paged';
import {
  WaiterPerformance,
  SalesReportFilters,
} from '@app/core/model/report/product-sale-report';
import { format } from 'date-fns';

@Component({
  selector: 'app-waiter-performance',
  standalone: true,
  imports: [
    BasePageComponent,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
  templateUrl: './waiter-performance.component.html',
  styleUrl: './waiter-performance.component.css',
})
export class WaiterPerformanceComponent implements OnInit {
  dateRangeForm: FormGroup;
  waiterPerformanceData: WaiterPerformance[] | null = null;
  isLoading = false;

  pagedData: Paged<WaiterPerformance> | null = null;
  currentPage = 1;
  pageSize = 10;

  orderStatusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'PAID', label: 'Pagado' },
    { value: 'SERVED', label: 'Servido' },
    { value: 'IN_PREPARATION', label: 'Preparando' },
    { value: 'PENDING', label: 'Pendiente' },
  ];

  private defaultStartDate = new Date();
  private defaultEndDate = new Date();

  Math = Math;

  constructor(
    private reportService: ReportService,
    private fb: FormBuilder,
    private navigationService: NavigationService
  ) {
    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 7);

    this.dateRangeForm = this.fb.group({
      startDate: [format(this.defaultStartDate, 'yyyy-MM-dd')],
      endDate: [format(this.defaultEndDate, 'yyyy-MM-dd')],
      orderStatus: ['PAID'],
    });
  }

  ngOnInit(): void {
    this.navigationService.configureNavbar(['home', 'report']);
    this.loadWaiterPerformanceData();
  }

  loadWaiterPerformanceData(): void {
    this.isLoading = true;
    const formValues = this.dateRangeForm.value;

    const filters: SalesReportFilters = {
      startDate: formValues.startDate,
      endDate: formValues.endDate,
      orderStatus: formValues.orderStatus || 'PAID',
    };

    this.reportService
      .getWaiterPerformanceReport(this.currentPage, this.pageSize, filters)
      .subscribe({
        next: (response) => {
          console.log('Waiter performance data received:', response.data);
          this.pagedData = response.data.content;
          this.waiterPerformanceData = this.pagedData.content;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading waiter performance data:', error);
          this.isLoading = false;
        },
      });
  }

  onFiltersChange(): void {
    this.currentPage = 1;
    this.loadWaiterPerformanceData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadWaiterPerformanceData();
  }

  onPreviousPage(): void {
    if (this.pagedData && !this.pagedData.first) {
      this.currentPage--;
      this.loadWaiterPerformanceData();
    }
  }

  onNextPage(): void {
    if (this.pagedData && !this.pagedData.last) {
      this.currentPage++;
      this.loadWaiterPerformanceData();
    }
  }

  getPageNumbers(): number[] {
    if (!this.pagedData) return [];

    const pages: number[] = [];
    const currentPageIndex = this.pagedData.pageNumber;
    const totalPages = this.pagedData.totalPages;

    const startPage = Math.max(1, currentPageIndex - 1);
    const endPage = Math.min(totalPages, currentPageIndex + 3);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  get totalElements(): number {
    return this.pagedData?.totalElements || 0;
  }

  get totalPages(): number {
    return this.pagedData?.totalPages || 0;
  }

  get isFirstPage(): boolean {
    return this.pagedData?.first || false;
  }

  get isLastPage(): boolean {
    return this.pagedData?.last || false;
  }

  get currentPageNumber(): number {
    return this.pagedData?.pageNumber || 1;
  }

  get startElement(): number {
    if (!this.pagedData) return 0;
    return (this.pagedData.pageNumber - 1) * this.pagedData.pageSize + 1;
  }

  get endElement(): number {
    if (!this.pagedData) return 0;
    return Math.min(
      this.pagedData.pageNumber * this.pagedData.pageSize,
      this.pagedData.totalElements
    );
  }

  getTotalRevenue(): number {
    return (
      this.waiterPerformanceData?.reduce(
        (sum, waiter) => sum + waiter.totalRevenue,
        0
      ) || 0
    );
  }

  getTotalOrders(): number {
    return (
      this.waiterPerformanceData?.reduce(
        (sum, waiter) => sum + waiter.totalOrders,
        0
      ) || 0
    );
  }

  getTopWaiter(): string {
    if (!this.waiterPerformanceData?.length) return 'N/A';
    const topWaiter = this.waiterPerformanceData.reduce((prev, current) =>
      prev.totalRevenue > current.totalRevenue ? prev : current
    );
    return topWaiter.lastName + ', ' + topWaiter.firstName;
  }

  trackByWaiterId(index: number, waiter: WaiterPerformance): number {
    return waiter.waiterId;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }
}
