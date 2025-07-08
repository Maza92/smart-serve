import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { defaultChartOptions } from '@app/core/model/chart';
import { cloneDeep, merge } from 'lodash-es';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-ui-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './ui-chart.component.html',
  styleUrl: './ui-chart.component.css',
})
export class UiChartComponent implements OnChanges {
  @Input() specificOptions: Partial<ApexOptions> = {};
  @ViewChild('chartInstance', { static: false }) chartInstance!: ChartComponent;

  public finalOptions: Partial<ApexOptions> = {};
  private isInitialized = false;

  ngOnInit(): void {
    this.buildChartOptions();
    this.isInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['specificOptions'] && this.isInitialized) {
      this.buildChartOptions();
      this.updateChart();
    }
  }

  private buildChartOptions(): void {
    const defaultCopy = cloneDeep(defaultChartOptions);
    this.finalOptions = merge(defaultCopy, cloneDeep(this.specificOptions));
  }

  private updateChart(): void {
    setTimeout(() => {
      if (this.chartInstance) {
        console.log('Updating chart with options:', this.finalOptions);
        this.chartInstance.updateOptions(this.finalOptions, true, true, true);
      }
    }, 0);
  }

  public updateChartData(newOptions: Partial<ApexOptions>): void {
    this.specificOptions = newOptions;
    this.buildChartOptions();
    this.updateChart();
  }
}
