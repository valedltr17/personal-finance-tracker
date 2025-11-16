import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {combineLatestWith} from 'rxjs';
import {CategorySummary, DashboardSummary, MonthlyTrend, TransactionType} from '../../../../core/models';
import {DashboardService} from '../../../../core/services';
import {
  Chart,
  ChartConfiguration,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PieController,
  BarController,
  BarElement,
  LineController,
  LineElement,
  DoughnutController,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

Chart.register(
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PieController,
  BarController,
  BarElement,
  LineController,
  LineElement,
  DoughnutController,
  Tooltip,
  Legend,
  Filler,
);

@Component({
  selector: 'app-dashboard.component',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  summary: DashboardSummary | null = null;
  monthlyTrend: MonthlyTrend[] = [];
  categoryBreakdown: CategorySummary[] = [];

  loading = false;
  error: string | null = null;

  startDate: string;
  endDate: string;
  selectedType: string | null = null;

  private monthlyChart: Chart | null = null;
  private categoryChart: Chart | null = null;

  constructor(private dashboardService: DashboardService) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.startDate = this.formatDate(firstDay);
    this.endDate = this.formatDate(now);
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    if (this.monthlyChart) this.monthlyChart.destroy();
    if (this.categoryChart) this.categoryChart.destroy();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    const dashboardSummary$ = this.getDashboardSummaryObs();
    const monthlyTrend$ = this.dashboardService.getMonthlyTrend(6);
    const categoryBreakdown$ = this.getCategoryBreakdownObs();

    dashboardSummary$.pipe(
      combineLatestWith(monthlyTrend$, categoryBreakdown$),
    )
      .subscribe({
        next: (([summary, trend, breakdown]) => {
          this.summary = summary;
          this.monthlyTrend = trend;
          this.categoryBreakdown = breakdown;

          this.loading = false;

          this.createCharts();
        })
      });
  }

  loadCategoryBreakdown(): void {
    const categoryBreakdown$ = this.getCategoryBreakdownObs();

    categoryBreakdown$
      .subscribe({
        next: (data) => {
          this.categoryBreakdown = data;
        },
        error: (err) => {
          console.log('Failed to load category breakdown', err);
        }
      })
  }

  onDateChange(): void {
    this.loadDashboard();
  }

  resetDates(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    this.startDate = this.formatDate(firstDay);
    this.endDate = this.formatDate(now);
    this.loadDashboard();
  }

  filterByType(type: string | null): void {
    this.selectedType = type;
    this.loadCategoryBreakdown();
  }

  private getDashboardSummaryObs() {
    return this.dashboardService.getDashboardSummary({
      startDate: this.startDate ? new Date(this.startDate) : undefined,
      endDate: this.endDate ? new Date(this.endDate) : undefined,
    });
  }

  private getCategoryBreakdownObs() {
    const type = !this.selectedType ? undefined : this.selectedType === 'Income' ? TransactionType.Income : TransactionType.Expense;
    return this.dashboardService.getCategoryBreakdown({
      transactionType: type,
      startDate: this.startDate ? new Date(this.startDate) : undefined,
      endDate: this.endDate ? new Date(this.endDate) : undefined
    });
  }

  private createCharts(): void {
    setTimeout(() => {
      this.createMonthlyTrendChart();
      this.createCategoryChart();
    }, 1);
  }

  private createMonthlyTrendChart(): void {
    const canvas = document.getElementById('monthlyTrendChart') as HTMLCanvasElement;
    if (!canvas || this.monthlyTrend.length === 0) return;

    // Destroy existing chart
    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.monthlyTrend.map(m => m.monthName),
        datasets: [
          {
            label: 'Income',
            data: this.monthlyTrend.map(m => m.income),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Expenses',
            data: this.monthlyTrend.map(m => m.expenses),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Net Balance',
            data: this.monthlyTrend.map(m => m.netBalance),
            type: 'line',
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }

                if (context.parsed.y) label += '$' + context.parsed.y.toLocaleString();
                return label;
              }
            }
          }
        }
      }
    };

    this.monthlyChart = new Chart(canvas, config);
  }

  private createCategoryChart(): void {
    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!canvas || !this.summary || this.summary.expensesByCategory.length === 0) return;

    // Destroy existing chart
    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: this.summary.expensesByCategory.map(c => c.categoryName),
        datasets: [{
          data: this.summary.expensesByCategory.map(c => c.amount),
          backgroundColor: this.summary.expensesByCategory.map(c => c.categoryColor),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;

                const dataset = context.dataset.data as Array<number>;
                const total = dataset.reduce((value, total) => value + total, 0);
                const percentage = ((value / total) * 100).toFixed(1);

                return `${label}: $${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.categoryChart = new Chart(canvas, config);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  protected readonly TransactionType = TransactionType;
}
