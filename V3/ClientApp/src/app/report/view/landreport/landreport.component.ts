import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-landreport',
  templateUrl: './landreport.component.html',
  styleUrls: ['./landreport.component.css']
})
export class LandreportComponent implements OnInit, AfterViewInit{
  // ---- Land Type ----
  landreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Land Type', 'Percentage', 'Count'];
  binders: string[] = ['name', 'percentage', 'count'];
  total: number[] = [];

  // ---- Fence Type ----
  fencereports: countreport[] = [];
  fenceData!: MatTableDataSource<countreport>;
  fenceColumns: string[] = ['name', 'percentage', 'count'];
  fenceHeaders: string[] = ['Fence Type', 'Percentage', 'Count'];
  fenceBinders: string[] = ['name', 'percentage', 'count'];
  fenceTotal: number[] = [];

  // ---- Land Feature (new) ----
  landfeaturereports: countreport[] = [];
  landfeatureData!: MatTableDataSource<countreport>;
  landfeatureColumns: string[] = ['name', 'percentage', 'count'];
  landfeatureHeaders: string[] = ['Land Feature', 'Percentage', 'Count'];
  landfeatureBinders: string[] = ['name', 'percentage', 'count'];
  landfeatureTotal: number[] = [];



  ftext = 'Total';
  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fencecolumnchart', { static: false }) fencecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fencepiechart', { static: false }) fencepiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('landfeaturecolumnchart', { static: false }) landfeaturecolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('landfeaturepiechart', { static: false }) landfeaturepiechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadFenceData();
    this.loadLandFeatureData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.landreports.length) {
      this.drawCharts();
    }
    if (this.fencereports.length) {
      this.drawFenceCharts();
    }
    if (this.landfeaturereports.length) {
      this.drawLandFeatureCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('landreport');
    this.landreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();
    if (this.viewReady) {
      this.drawCharts();
    }
  }

  async loadFenceData(): Promise<void> {
    const result = await this.rs.getCountReport('fencereport');
    this.fencereports = result;
    this.fenceTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadFenceTable();
    if (this.viewReady) {
      this.drawFenceCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.landreports);
  }

  loadFenceTable(): void {
    this.fenceData = new MatTableDataSource(this.fencereports);
  }

  drawCharts(): void {
    const labels = this.landreports.map(sm => sm.name);
    const counts = this.landreports.map(sm => sm.count);
    const percentages = this.landreports.map(sm => sm.percentage);

    new Chart(this.columnchart.nativeElement, {
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
          title: { display: true, text: 'Land Type Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Land Types' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });

    new Chart(this.piechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Count', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Land types Report (Pie Chart)' }
        }
      }
    });
  }

  drawFenceCharts(): void {
    const labels = this.fencereports.map(sm => sm.name);
    const counts = this.fencereports.map(sm => sm.count);
    const percentages = this.fencereports.map(sm => sm.percentage);

    new Chart(this.fencecolumnchart.nativeElement, {
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
          title: { display: true, text: 'Fence Type Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Fence Types' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });

    new Chart(this.fencepiechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Count', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Fence Types Report (Pie Chart)' }
        }
      }
    });
  }

  // Land feature
  async loadLandFeatureData(): Promise<void> {
    const result = await this.rs.getCountReport('landfeaturereport');
    this.landfeaturereports = result;
    this.landfeatureTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadLandFeatureTable();
    if (this.viewReady) {
      this.drawLandFeatureCharts();
    }
  }

  loadLandFeatureTable(): void {
    this.landfeatureData = new MatTableDataSource(this.landfeaturereports);
  }

  drawLandFeatureCharts(): void {
    const labels = this.landfeaturereports.map(sm => sm.name);
    const counts = this.landfeaturereports.map(sm => sm.count);
    const percentages = this.landfeaturereports.map(sm => sm.percentage);

    new Chart(this.landfeaturecolumnchart.nativeElement, {
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
          title: { display: true, text: 'Land Feature Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Land Features' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });

    new Chart(this.landfeaturepiechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Count', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Land Feature Report (Pie Chart)' }
        }
      }
    });
  }
}
