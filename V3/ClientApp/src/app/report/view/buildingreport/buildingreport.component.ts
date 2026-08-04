import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-buildingreport',
  templateUrl: './buildingreport.component.html',
  styleUrls: ['./buildingreport.component.css']
})
export class BuildingreportComponent implements OnInit, AfterViewInit {

  // ---- Usage ----
  usagereports: countreport[] = [];
  usageData!: MatTableDataSource<countreport>;
  usageColumns: string[] = ['name', 'percentage', 'count'];
  usageHeaders: string[] = ['Usage', 'Percentage', 'Count'];
  usageBinders: string[] = ['name', 'percentage', 'count'];
  usageTotal: number[] = [];

  // ---- Ownership Type ----
  ownershiptypereports: countreport[] = [];
  ownershiptypeData!: MatTableDataSource<countreport>;
  ownershiptypeColumns: string[] = ['name', 'percentage', 'count'];
  ownershiptypeHeaders: string[] = ['Ownership Type', 'Percentage', 'Count'];
  ownershiptypeBinders: string[] = ['name', 'percentage', 'count'];
  ownershiptypeTotal: number[] = [];

  // ---- Building Type ----
  buildingtypereports: countreport[] = [];
  buildingtypeData!: MatTableDataSource<countreport>;
  buildingtypeColumns: string[] = ['name', 'percentage', 'count'];
  buildingtypeHeaders: string[] = ['Building Type', 'Percentage', 'Count'];
  buildingtypeBinders: string[] = ['name', 'percentage', 'count'];
  buildingtypeTotal: number[] = [];

  // ---- Wall Type ----
  walltypereports: countreport[] = [];
  walltypeData!: MatTableDataSource<countreport>;
  walltypeColumns: string[] = ['name', 'percentage', 'count'];
  walltypeHeaders: string[] = ['Wall Type', 'Percentage', 'Count'];
  walltypeBinders: string[] = ['name', 'percentage', 'count'];
  walltypeTotal: number[] = [];

  // ---- Floor Type ----
  floortypereports: countreport[] = [];
  floortypeData!: MatTableDataSource<countreport>;
  floortypeColumns: string[] = ['name', 'percentage', 'count'];
  floortypeHeaders: string[] = ['Floor Type', 'Percentage', 'Count'];
  floortypeBinders: string[] = ['name', 'percentage', 'count'];
  floortypeTotal: number[] = [];

  // ---- Roof Type ----
  rooftypereports: countreport[] = [];
  rooftypeData!: MatTableDataSource<countreport>;
  rooftypeColumns: string[] = ['name', 'percentage', 'count'];
  rooftypeHeaders: string[] = ['Roof Type', 'Percentage', 'Count'];
  rooftypeBinders: string[] = ['name', 'percentage', 'count'];
  rooftypeTotal: number[] = [];

  ftext = 'Total';
  private viewReady = false;

  @ViewChild('usagecolumnchart', { static: false }) usagecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usagepiechart', { static: false }) usagepiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ownershiptypecolumnchart', { static: false }) ownershiptypecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ownershiptypepiechart', { static: false }) ownershiptypepiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('buildingtypecolumnchart', { static: false }) buildingtypecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('buildingtypepiechart', { static: false }) buildingtypepiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('walltypecolumnchart', { static: false }) walltypecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('walltypepiechart', { static: false }) walltypepiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('floortypecolumnchart', { static: false }) floortypecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('floortypepiechart', { static: false }) floortypepiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rooftypecolumnchart', { static: false }) rooftypecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rooftypepiechart', { static: false }) rooftypepiechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadUsageData();
    this.loadOwnershiptypeData();
    this.loadBuildingtypeData();
    this.loadWalltypeData();
    this.loadFloortypeData();
    this.loadRooftypeData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.usagereports.length) this.drawUsageCharts();
    if (this.ownershiptypereports.length) this.drawOwnershiptypeCharts();
    if (this.buildingtypereports.length) this.drawBuildingtypeCharts();
    if (this.walltypereports.length) this.drawWalltypeCharts();
    if (this.floortypereports.length) this.drawFloortypeCharts();
    if (this.rooftypereports.length) this.drawRooftypeCharts();
  }

  // ---- Usage ----
  async loadUsageData(): Promise<void> {
    const result = await this.rs.getCountReport('usagereport');
    this.usagereports = result;
    this.usageTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.usageData = new MatTableDataSource(this.usagereports);
    if (this.viewReady) this.drawUsageCharts();
  }

  drawUsageCharts(): void {
    const labels = this.usagereports.map(sm => sm.name);
    const counts = this.usagereports.map(sm => sm.count);
    const percentages = this.usagereports.map(sm => sm.percentage);

    new Chart(this.usagecolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Usage Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Usage' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.usagepiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Usage Report (Pie Chart)' } } }
    });
  }

  // ---- Ownership Type ----
  async loadOwnershiptypeData(): Promise<void> {
    const result = await this.rs.getCountReport('ownershiptypereport');
    this.ownershiptypereports = result;
    this.ownershiptypeTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.ownershiptypeData = new MatTableDataSource(this.ownershiptypereports);
    if (this.viewReady) this.drawOwnershiptypeCharts();
  }

  drawOwnershiptypeCharts(): void {
    const labels = this.ownershiptypereports.map(sm => sm.name);
    const counts = this.ownershiptypereports.map(sm => sm.count);
    const percentages = this.ownershiptypereports.map(sm => sm.percentage);

    new Chart(this.ownershiptypecolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Ownership Type Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Ownership Type' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.ownershiptypepiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Ownership Type Report (Pie Chart)' } } }
    });
  }

  // ---- Building Type ----
  async loadBuildingtypeData(): Promise<void> {
    const result = await this.rs.getCountReport('buildingtypereport');
    this.buildingtypereports = result;
    this.buildingtypeTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.buildingtypeData = new MatTableDataSource(this.buildingtypereports);
    if (this.viewReady) this.drawBuildingtypeCharts();
  }

  drawBuildingtypeCharts(): void {
    const labels = this.buildingtypereports.map(sm => sm.name);
    const counts = this.buildingtypereports.map(sm => sm.count);
    const percentages = this.buildingtypereports.map(sm => sm.percentage);

    new Chart(this.buildingtypecolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Building Type Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Building Type' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.buildingtypepiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Building Type Report (Pie Chart)' } } }
    });
  }

  // ---- Wall Type ----
  async loadWalltypeData(): Promise<void> {
    const result = await this.rs.getCountReport('walltypereport');
    this.walltypereports = result;
    this.walltypeTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.walltypeData = new MatTableDataSource(this.walltypereports);
    if (this.viewReady) this.drawWalltypeCharts();
  }

  drawWalltypeCharts(): void {
    const labels = this.walltypereports.map(sm => sm.name);
    const counts = this.walltypereports.map(sm => sm.count);
    const percentages = this.walltypereports.map(sm => sm.percentage);

    new Chart(this.walltypecolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Wall Type Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Wall Type' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.walltypepiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Wall Type Report (Pie Chart)' } } }
    });
  }

  // ---- Floor Type ----
  async loadFloortypeData(): Promise<void> {
    const result = await this.rs.getCountReport('floortypereport');
    this.floortypereports = result;
    this.floortypeTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.floortypeData = new MatTableDataSource(this.floortypereports);
    if (this.viewReady) this.drawFloortypeCharts();
  }

  drawFloortypeCharts(): void {
    const labels = this.floortypereports.map(sm => sm.name);
    const counts = this.floortypereports.map(sm => sm.count);
    const percentages = this.floortypereports.map(sm => sm.percentage);

    new Chart(this.floortypecolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Floor Type Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Floor Type' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.floortypepiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Floor Type Report (Pie Chart)' } } }
    });
  }

  // ---- Roof Type ----
  async loadRooftypeData(): Promise<void> {
    const result = await this.rs.getCountReport('rooftypereport');
    this.rooftypereports = result;
    this.rooftypeTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.rooftypeData = new MatTableDataSource(this.rooftypereports);
    if (this.viewReady) this.drawRooftypeCharts();
  }

  drawRooftypeCharts(): void {
    const labels = this.rooftypereports.map(sm => sm.name);
    const counts = this.rooftypereports.map(sm => sm.count);
    const percentages = this.rooftypereports.map(sm => sm.percentage);

    new Chart(this.rooftypecolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Roof Type Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Roof Type' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.rooftypepiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Roof Type Report (Pie Chart)' } } }
    });
  }
}
