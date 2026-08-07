import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-certificatereport',
  templateUrl: './certificatereport.component.html',
  styleUrls: ['./certificatereport.component.css']
})
export class CertificatereportComponent implements OnInit, AfterViewInit {

  certificatereports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Status', 'Percentage', 'Count'];
  binders: string[] = ['name', 'percentage', 'count'];
  ftext = 'Total';
  total: number[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  statusId: number | null = null;
  picked: number | null = null; // null = all, 1 = picked, 0 = not picked
  statuses: any[] = [];

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadStatuses();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.certificatereports.length) {
      this.drawCharts();
    }
  }

  async loadStatuses(): Promise<void> {
    this.statuses = await this.rs.getCountReport('requeststatuses') as any;
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('certificatereport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    const params: string[] = [];

    if (this.statusId !== null && this.statusId !== undefined) {
      params.push(`statusId=${this.statusId}`);
    }
    if (this.picked !== null && this.picked !== undefined) {
      params.push(`picked=${this.picked}`);
    }
    if (this.startDate) {
      params.push(`start=${this.formatDate(this.startDate)}`);
    }
    if (this.endDate) {
      params.push(`end=${this.formatDate(this.endDate)}`);
    }

    let path = 'certificatereport';
    if (params.length) {
      path += '?' + params.join('&');
    }

    const result = await this.rs.getCountReport(path);
    this.applyResult(result);
  }

  clearFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.statusId = null;
    this.picked = null;
    this.loadData();
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private applyResult(result: countreport[]): void {
    this.certificatereports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.certificatereports);
  }

  drawCharts(): void {

    this.destroyCharts();
    const labels = this.certificatereports.map(sm => sm.name);
    const counts = this.certificatereports.map(sm => sm.count);
    const percentages = this.certificatereports.map(sm => sm.percentage);

    this.track(new Chart(this.columnchart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Count', data: counts },
          { label: 'Percentage', data: percentages }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Certificate Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Status' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    }));

    this.track(new Chart(this.piechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Count', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Certificate Report (Pie Chart)' }
        }
      }
    }));
  }

  // Chart.js refuses to reuse a canvas, so keep the instances and destroy
  // them before every redraw - otherwise Search/Clear throws and the charts freeze.
  private charts: any[] = [];
  track(chart: any): any { this.charts.push(chart); return chart; }
  private destroyCharts(): void {
    this.charts.forEach(c => { try { c.destroy(); } catch (e) { } });
    this.charts = [];
  }
}
