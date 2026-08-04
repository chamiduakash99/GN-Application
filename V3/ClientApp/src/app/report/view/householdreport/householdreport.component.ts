import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-householdreport',
  templateUrl: './householdreport.component.html',
  styleUrls: ['./householdreport.component.css']
})
export class HouseholdreportComponent implements OnInit, AfterViewInit {

  householdreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Member Count', 'Percentage', 'Households'];
  binders: string[] = ['name', 'percentage', 'count'];
  ftext = 'Total';
  total: number[] = [];

  minMembers: number | null = null;
  maxMembers: number | null = null;

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.householdreports.length) {
      this.drawCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('householdreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    let path = 'householdreport';
    const params: string[] = [];

    if (this.minMembers !== null && this.minMembers !== undefined) {
      params.push(`min=${this.minMembers}`);
    }
    if (this.maxMembers !== null && this.maxMembers !== undefined) {
      params.push(`max=${this.maxMembers}`);
    }
    if (params.length) {
      path += '?' + params.join('&');
    }

    const result = await this.rs.getCountReport(path);
    this.applyResult(result);
  }

  clearFilter(): void {
    this.minMembers = null;
    this.maxMembers = null;
    this.loadData();
  }

  private applyResult(result: countreport[]): void {
    this.householdreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.householdreports);
  }

  drawCharts(): void {
    const labels = this.householdreports.map(sm => sm.name);
    const counts = this.householdreports.map(sm => sm.count);
    const percentages = this.householdreports.map(sm => sm.percentage);

    new Chart(this.columnchart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Households', data: counts },
          { label: 'Percentage', data: percentages }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Household Member Count Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Member Count' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });

    new Chart(this.piechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Households', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Household Member Count Report (Pie Chart)' }
        }
      }
    });
  }
}
