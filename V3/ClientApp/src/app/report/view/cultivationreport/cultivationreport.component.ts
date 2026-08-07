import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-cultivationreport',
  templateUrl: './cultivationreport.component.html',
  styleUrls: ['./cultivationreport.component.css']
})
export class CultivationreportComponent implements OnInit, AfterViewInit {

  cultivationreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count', 'value'];
  headers: string[] = ['Crop Type', 'Percentage', 'Count', 'Total Area'];
  binders: string[] = ['name', 'percentage', 'count', 'value'];
  ftext = 'Total';
  total: number[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  statusId: number | null = null;
  minArea: number | null = null;
  maxArea: number | null = null;
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
    if (this.cultivationreports.length) {
      this.drawCharts();
    }
  }

  async loadStatuses(): Promise<void> {
    this.statuses = await this.rs.getCountReport('cultivationstatuses') as any;
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('cultivationreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    const params: string[] = [];

    if (this.statusId !== null && this.statusId !== undefined) {
      params.push(`statusId=${this.statusId}`);
    }
    if (this.startDate) {
      params.push(`start=${this.formatDate(this.startDate)}`);
    }
    if (this.endDate) {
      params.push(`end=${this.formatDate(this.endDate)}`);
    }
    if (this.minArea !== null && this.minArea !== undefined) {
      params.push(`minArea=${this.minArea}`);
    }
    if (this.maxArea !== null && this.maxArea !== undefined) {
      params.push(`maxArea=${this.maxArea}`);
    }

    let path = 'cultivationreport';
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
    this.minArea = null;
    this.maxArea = null;
    this.loadData();
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private applyResult(result: countreport[]): void {
    this.cultivationreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.cultivationreports);
  }

  drawCharts(): void {

    this.destroyCharts();
    const labels = this.cultivationreports.map(sm => sm.name);
    const counts = this.cultivationreports.map(sm => sm.count);
    const percentages = this.cultivationreports.map(sm => sm.percentage);

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
          title: { display: true, text: 'Cultivation Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Crop Type' } },
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
          title: { display: true, text: 'Cultivation Report (Pie Chart)' }
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
