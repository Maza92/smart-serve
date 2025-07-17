import { ApexOptions } from 'ng-apexcharts';

export const defaultChartOptions: Partial<ApexOptions> = {
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      dynamicAnimation: {
        enabled: true,
        speed: 1000,
      },
    },
  },
  colors: ['#c67c4e', '#1A73E8', '#B32824'],
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: ['#c67c4e'],
  },
  grid: {
    strokeDashArray: 4,
    borderColor: '#99a1af',
  },

  markers: {
    size: 5,
    colors: ['#ffffff'],
    strokeColors: '#c67c4e',
    strokeWidth: 2,
  },

  dataLabels: {
    enabled: false,
  },

  tooltip: {
    theme: 'dark',
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const value = series[seriesIndex][dataPointIndex];
      const seriesName = w.globals.seriesNames[seriesIndex];
      return `
        <div style="background-color: #1a120d; color: #ffffff; padding: 10px 15px; border-radius: 8px; border: 1px solid #52443c; font-family: sans-serif; font-size: 12px;">
          <strong>${seriesName}:</strong> $${value}
        </div>
      `;
    },
    y: {
      formatter: (val) => `${val}`,
    },
  },

  xaxis: {
    labels: {
      style: {
        colors: '#364153',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },

  yaxis: {
    labels: {
      style: {
        colors: '#6a7282',
      },
      formatter: (val) => `${val}`,
    },
  },

  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5,
    labels: {
      colors: '#ededed',
    },
  },
};
