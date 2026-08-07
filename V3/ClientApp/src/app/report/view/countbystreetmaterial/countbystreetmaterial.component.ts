import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../reportservice';
import { countreport } from '../../entity/countreport';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-countbystreetmaterial',
  templateUrl: './countbystreetmaterial.component.html',
  styleUrls: ['./countbystreetmaterial.component.css']
})
export class CountByStreetMaterialComponent implements OnInit, AfterViewInit {

  // ── Street Material ────────────────────────────────────────────────────────
  countByStreetMaterials: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count', 'value'];
  headers: string[] = ['Street Material', 'Percentage', 'Count', 'Total Length (m)'];
  binders: string[] = ['name', 'percentage', 'count', 'value'];
  total: number[] = [];

  // ── Street Status ──────────────────────────────────────────────────────────
  streetStatusReports: countreport[] = [];
  statusData!: MatTableDataSource<countreport>;
  statusColumns: string[] = ['name', 'percentage', 'count', 'value'];
  statusHeaders: string[] = ['Street Status', 'Percentage', 'Count', 'Total Length (m)'];
  statusBinders: string[] = ['name', 'percentage', 'count', 'value'];
  statusTotal: number[] = [];

  ftext = 'Total';

  // ── Length filter ──────────────────────────────────────────────────────────
  minLength: number | null = null;
  maxLength: number | null = null;

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statuscolumnchart', { static: false }) statuscolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('statuspiechart', { static: false }) statuspiechart!: ElementRef<HTMLCanvasElement>;

  // Chart.js refuses to reuse a canvas, so keep the instances and destroy them
  // before every redraw (the Search button redraws).
  private charts: Chart[] = [];

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.countByStreetMaterials.length || this.streetStatusReports.length) {
      this.drawCharts();
    }
  }

  /** builds ?minLength=..&maxLength=.. from whatever the user typed */
  private query(): string {
    const params: string[] = [];
    if (this.minLength !== null && this.minLength !== undefined && String(this.minLength) !== '') {
      params.push('minLength=' + this.minLength);
    }
    if (this.maxLength !== null && this.maxLength !== undefined && String(this.maxLength) !== '') {
      params.push('maxLength=' + this.maxLength);
    }
    return params.length ? '?' + params.join('&') : '';
  }

  async loadData(): Promise<void> {
    const q = this.query();
    try {
      const material = await this.rs.getCountReport('countbystreetmaterial' + q);
      this.countByStreetMaterials = material ?? [];
      this.total = [this.countByStreetMaterials.reduce((sum, item) => sum + item.count, 0)];

      const status = await this.rs.getCountReport('streetstatusreport' + q);
      this.streetStatusReports = status ?? [];
      this.statusTotal = [this.streetStatusReports.reduce((sum, item) => sum + item.count, 0)];
    } catch (error) {
      console.error('Street report load failed:', error);
      this.countByStreetMaterials = [];
      this.streetStatusReports = [];
      this.total = [0];
      this.statusTotal = [0];
    }

    this.loadTable();
    if (this.viewReady) {
      this.drawCharts();
    }
  }

  applyFilter(): void {
    this.loadData();
  }

  clearFilter(): void {
    this.minLength = null;
    this.maxLength = null;
    this.loadData();
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.countByStreetMaterials);
    this.statusData = new MatTableDataSource(this.streetStatusReports);
  }

  drawCharts(): void {
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    this.charts.push(this.bar(this.columnchart, this.countByStreetMaterials,
      'Street Material Report (Bar Chart)', 'Street Material'));
    this.charts.push(this.pie(this.piechart, this.countByStreetMaterials,
      'Street Material Report (Pie Chart)'));
    this.charts.push(this.bar(this.statuscolumnchart, this.streetStatusReports,
      'Street Status Report (Bar Chart)', 'Street Status'));
    this.charts.push(this.pie(this.statuspiechart, this.streetStatusReports,
      'Street Status Report (Pie Chart)'));
  }

  private bar(canvas: ElementRef<HTMLCanvasElement>, rows: countreport[], title: string, axis: string): Chart {
    return new Chart(canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: rows.map(r => r.name),
        datasets: [
          { label: 'Count', data: rows.map(r => r.count) },
          { label: 'Percentage', data: rows.map(r => r.percentage) }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: title },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: axis } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });
  }

  private pie(canvas: ElementRef<HTMLCanvasElement>, rows: countreport[], title: string): Chart {
    return new Chart(canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: rows.map(r => r.name),
        datasets: [{ label: 'Count', data: rows.map(r => r.count) }]
      },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: title } }
      }
    });
  }
}
