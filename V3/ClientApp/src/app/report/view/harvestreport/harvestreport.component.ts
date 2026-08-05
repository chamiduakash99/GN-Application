import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-harvestreport',
  templateUrl: './harvestreport.component.html',
  styleUrls: ['./harvestreport.component.css']
})
export class HarvestreportComponent implements OnInit, AfterViewInit {

  harvestreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count', 'value'];
  headers: string[] = ['Month', 'Percentage', 'Harvest Count', 'Total Quantity'];
  binders: string[] = ['name', 'percentage', 'count', 'value'];
  ftext = 'Total';
  total: number[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  minQty: number | null = null;
  maxQty: number | null = null;

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.harvestreports.length) {
      this.drawCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('harvestreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    const params: string[] = [];

    if (this.startDate) {
      params.push(`start=${this.formatDate(this.startDate)}`);
    }
    if (this.endDate) {
      params.push(`end=${this.formatDate(this.endDate)}`);
    }
    if (this.minQty !== null && this.minQty !== undefined) {
      params.push(`minQty=${this.minQty}`);
    }
    if (this.maxQty !== null && this.maxQty !== undefined) {
      params.push(`maxQty=${this.maxQty}`);
    }

    let path = 'harvestreport';
    if (params.length) {
      path += '?' + params.join('&');
    }

    const result = await this.rs.getCountReport(path);
    this.applyResult(result);
  }

  clearFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.minQty = null;
    this.maxQty = null;
    this.loadData();
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private applyResult(result: countreport[]): void {
    this.harvestreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.harvestreports);
  }

  drawCharts(): void {
    const labels = this.harvestreports.map(sm => sm.name);
    const counts = this.harvestreports.map(sm => sm.count);
    const percentages = this.harvestreports.map(sm => sm.percentage);

    new Chart(this.columnchart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Harvest Count', data: counts },
          { label: 'Percentage', data: percentages }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Harvest Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Month' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });

    new Chart(this.piechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Harvest Count', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Harvest Report (Pie Chart)' }
        }
      }
    });
  }
}
