import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-complaintreport',
  templateUrl: './complaintreport.component.html',
  styleUrls: ['./complaintreport.component.css']
})
export class ComplaintreportComponent implements OnInit, AfterViewInit {

  complaintreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Status', 'Percentage', 'Count'];
  binders: string[] = ['name', 'percentage', 'count'];
  ftext = 'Total';
  total: number[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  statusId: number | null = null;
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
    if (this.complaintreports.length) {
      this.drawCharts();
    }
  }

  async loadStatuses(): Promise<void> {
    this.statuses = await this.rs.getCountReport('complaintstatuses') as any;
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('complaintreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    const params: string[] = [];

    if (this.startDate) {
      params.push(`start=${this.formatDateTime(this.startDate, '00:00:00')}`);
    }
    if (this.endDate) {
      params.push(`end=${this.formatDateTime(this.endDate, '23:59:59')}`);
    }
    if (this.statusId !== null && this.statusId !== undefined) {
      params.push(`statusId=${this.statusId}`);
    }

    let path = 'complaintreport';
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
    this.loadData();
  }

  private formatDateTime(date: Date, time: string): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${time}`;
  }

  private applyResult(result: countreport[]): void {
    this.complaintreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.complaintreports);
  }

  drawCharts(): void {
    const labels = this.complaintreports.map(sm => sm.name);
    const counts = this.complaintreports.map(sm => sm.count);
    const percentages = this.complaintreports.map(sm => sm.percentage);

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
          title: { display: true, text: 'Complaint Report (Bar Chart)' },
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
          title: { display: true, text: 'Complaint Report (Pie Chart)' }
        }
      }
    });
  }
}
