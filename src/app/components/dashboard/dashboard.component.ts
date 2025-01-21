import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'node_modules/chart.js'
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { InvoiceService } from 'src/app/services/invoiceService/invoice.service';
import { UsersService } from 'src/app/services/userService/users.service';
import { InventoryService } from 'src/app/services/inventoryService/inventory.service';
import { QuotationService } from 'src/app/services/priceService/quotation.service';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  path: string = '';
  chart: Chart | undefined;
  salesGrowthChart: Chart | undefined;
  totalCustomers: number = 0;
  change: number = 0;
  recentInvoices: any = [];
  Math = Math;
  totalAmount: number = 0;
  amountsByStatus: { [key: string]: number } = {};
  latestQuotations: any[] = [];
  statusSummary: { status: string; percentage: number }[] = [];
  completedTotal:number=0;
  totalSales: number = 0;
  totalReceipts: number = 0;
  totalExpenses: number = 0;
  earnings: number = 0;
  constructor(private router: Router, private userServ: UsersService,
     private invoiceService: InvoiceService, private inventoryService: InventoryService,
      private quotationsService: QuotationService) { }

  ngOnInit(): void {
    this.createDoughnutChart
    this.path = this.router.url
    this.userServ.getCustomerStats().subscribe(
      (data) => {
        this.totalCustomers = data.total;
      },
      (error) => {
        console.error('Error fetching customer stats:', error);
      }
    );
    this.fetchDashboardSummary();
    this.fetchTotalInvoiceAmount();
    this.fetchAmountsByStatus();
    this.fetchSalesGrowth();
    this.fetchRecentInvoices();
  }
  fetchTotalInvoiceAmount(): void {
    this.invoiceService.getTotalInvoiceAmount().subscribe(
      (data) => {
        this.totalAmount = data.totalInvoices;
        console.log("here total", this.totalAmount);
      },
      (error) => {
        console.error('Error fetching total invoice amount:', error);
      }
    );
  }
  fetchAmountsByStatus(): void {
    this.invoiceService.getInvoiceAmountsByStatus().subscribe(
      (data) => {
        this.amountsByStatus = data.statusAmounts.reduce((acc: any, status: any) => {
          acc[status._id] = status.total;
          return acc;
        }, {});

        this.createDoughnutChart();
      },
      (error) => {
        console.error('Error fetching invoice amounts by status:', error);
      }
    );
  }
  fetchSalesGrowth(): void {
    this.inventoryService.getSalesGrowth().subscribe(
      (data) => {
        console.log(data.total);

        this.totalSales = data.total.totalSales;
        this.totalReceipts = data.total.totalReceipts;
        this.totalExpenses = data.total.totalExpenses;
        this.earnings = data.total.earnings;

        // Create the area chart
        this.createAreaChart();
      },
      (error) => {
        console.error('Error fetching sales growth:', error);
      }
    );
  }
  fetchRecentInvoices(): void {
    this.invoiceService.getRecentInvoices().subscribe(
      (data) => {
        this.recentInvoices = data.invoices;
        console.log(this.recentInvoices);

      },
      (error) => {
        console.error('Error fetching recent invoices:', error);
      }
    );
  }
  fetchDashboardSummary(): void {
    this.quotationsService.getDashboardSummary().subscribe(
      (data) => {
        this.latestQuotations = data.last;
        this.statusSummary = data.status;
        this.completedTotal=data.completedTotal
        console.log("here quotation", this.latestQuotations,this.statusSummary);
      },
      (error) => {
        console.error('Error fetching dashboard summary', error);
      }
    );
  }

  createDoughnutChart(): void {
    console.log("here charts");

    const data: ChartData<'doughnut'> = {
      labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
      datasets: [
        {
          data: [
            this.amountsByStatus['Pending'] || 0,
            this.amountsByStatus['Approved'] || 0,
            this.amountsByStatus['Rejected'] || 0,
            this.amountsByStatus['Completed'] || 0,
          ],
          backgroundColor: ['#FFCE56', '#4BC0C0', '#FF6384', '#36A2EB'],
        },
      ],
    };

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    };

    if (this.chart) {
      this.chart.destroy(); // Destroy the old chart if it exists
    }

    this.chart = new Chart('invoice_chart', config); // Create a new chart
  }
  createAreaChart(): void {
    const labels = ['Sales', 'Receipts', 'Expenses', 'Earnings'];
    const values = [this.totalSales, this.totalReceipts, this.totalExpenses, this.earnings];

    const data: ChartData<'line'> = {
      labels: labels,
      datasets: [
        {
          label: 'Total Sales',
          data: [this.totalSales],
          fill: true,
          borderColor: 'rgba(54, 162, 235, 1)', // Blue line
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4,
        },
        {
          label: 'Total Receipts',
          data: [this.totalReceipts],
          fill: true,
          borderColor: 'rgba(75, 192, 75, 1)', // Green line
          backgroundColor: 'rgba(75, 192, 75, 0.2)',
          tension: 0.4,
        },
        {
          label: 'Total Expenses',
          data: [this.totalExpenses],
          fill: true,
          borderColor: 'rgba(255, 99, 132, 1)', // Red line
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
        },
        {
          label: 'Earnings',
          data: [this.earnings],
          fill: true,
          borderColor: 'rgba(153, 102, 255, 1)', // Purple line
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4,
        },
      ],
    };

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Metrics',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Amount ($)',
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (this.salesGrowthChart) {
      this.salesGrowthChart.destroy(); // Destroy previous chart instance if it exists
    }

    this.salesGrowthChart = new Chart('salesGrowthChart', config); // Create new chart instance
  }

  // createAreaChart(): void {
  //   const labels = ['Sales', 'Receipts', 'Expenses', 'Earnings'];
  //   const values = [this.totalSales, this.totalReceipts, this.totalExpenses, this.earnings];

  //   const data: ChartData<'line'> = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'Total Values',
  //         data: values,
  //         fill: true,
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //         tension: 0.4,
  //       },
  //     ],
  //   };

  //   const config: ChartConfiguration<'line'> = {
  //     type: 'line',
  //     data: data,
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           display: true,
  //           position: 'top',
  //         },
  //       },
  //       scales: {
  //         x: {
  //           title: {
  //             display: true,
  //             text: 'Metrics',
  //           },
  //         },
  //         y: {
  //           title: {
  //             display: true,
  //             text: 'Amount ($)',
  //           },
  //           beginAtZero: true,
  //         },
  //       },
  //     },
  //   };

  //   if (this.chart) {
  //     this.chart.destroy(); // Destroy previous chart instance if it exists
  //   }

  //   this.chart = new Chart('salesGrowthChart', config); // Create new chart instance
  // }
}


