import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-announcementreport',
  templateUrl: './announcementreport.component.html',
  styleUrls: ['./announcementreport.component.css']
})
export class AnnouncementreportComponent implements OnInit, AfterViewInit {

  announcementreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Status', 'Percentage', 'Count'];
  binders: string[] = ['name', 'percentage', 'count'];
  ftext = 'Total';
  total: number[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.announcementreports.length) {
      this.drawCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('announcementreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    if (!this.startDate || !this.endDate) {
      this.loadData();
      return;
    }
    const start = this.formatDateTime(this.startDate, '00:00:00');
    const end = this.formatDateTime(this.endDate, '23:59:59');
    const result = await this.rs.getCountReport(`announcementreport?start=${start}&end=${end}`);
    this.applyResult(result);
  }

  private formatDateTime(date: Date, time: string): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${time}`;
  }

  clearFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadData();
  }

  private applyResult(result: countreport[]): void {
    this.announcementreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.announcementreports);
  }

  drawCharts(): void {
    const labels = this.announcementreports.map(sm => sm.name);
    const counts = this.announcementreports.map(sm => sm.count);
    const percentages = this.announcementreports.map(sm => sm.percentage);

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
          title: { display: true, text: 'Announcement Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Status' } },
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
          title: { display: true, text: 'Announcement Report (Pie Chart)' }
        }
      }
    });
  }
}
