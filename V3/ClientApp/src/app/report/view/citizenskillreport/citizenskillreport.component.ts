import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-citizenskillreport',
  templateUrl: './citizenskillreport.component.html',
  styleUrls: ['./citizenskillreport.component.css']
})
export class CitizenskillreportComponent implements OnInit, AfterViewInit {

  citizenskillreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count', 'value'];
  headers: string[] = ['Profession', 'Percentage', 'Count', 'Avg Income'];
  binders: string[] = ['name', 'percentage', 'count', 'value'];
  ftext = 'Total';
  total: number[] = [];

  professionId: number | null = null;
  minExp: number | null = null;
  maxExp: number | null = null;
  minIncome: number | null = null;
  maxIncome: number | null = null;
  professions: any[] = [];

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadProfessions();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.citizenskillreports.length) {
      this.drawCharts();
    }
  }

  async loadProfessions(): Promise<void> {
    this.professions = await this.rs.getCountReport('professions') as any;
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('citizenskillreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    const params: string[] = [];

    if (this.professionId !== null && this.professionId !== undefined) {
      params.push(`professionId=${this.professionId}`);
    }
    if (this.minExp !== null && this.minExp !== undefined) {
      params.push(`minExp=${this.minExp}`);
    }
    if (this.maxExp !== null && this.maxExp !== undefined) {
      params.push(`maxExp=${this.maxExp}`);
    }
    if (this.minIncome !== null && this.minIncome !== undefined) {
      params.push(`minIncome=${this.minIncome}`);
    }
    if (this.maxIncome !== null && this.maxIncome !== undefined) {
      params.push(`maxIncome=${this.maxIncome}`);
    }

    let path = 'citizenskillreport';
    if (params.length) {
      path += '?' + params.join('&');
    }

    const result = await this.rs.getCountReport(path);
    this.applyResult(result);
  }

  clearFilter(): void {
    this.professionId = null;
    this.minExp = null;
    this.maxExp = null;
    this.minIncome = null;
    this.maxIncome = null;
    this.loadData();
  }

  private applyResult(result: countreport[]): void {
    this.citizenskillreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.citizenskillreports);
  }

  drawCharts(): void {
    const labels = this.citizenskillreports.map(sm => sm.name);
    const counts = this.citizenskillreports.map(sm => sm.count);
    const percentages = this.citizenskillreports.map(sm => sm.percentage);

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
          title: { display: true, text: 'Citizen Skill Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Profession' } },
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
          title: { display: true, text: 'Citizen Skill Report (Pie Chart)' }
        }
      }
    });
  }
}
