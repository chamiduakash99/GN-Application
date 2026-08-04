import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-voterregistryreport',
  templateUrl: './voterregistryreport.component.html',
  styleUrls: ['./voterregistryreport.component.css']
})
export class VoterregistryreportComponent implements OnInit, AfterViewInit {

  voterreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Age', 'Percentage', 'Voters'];
  binders: string[] = ['name', 'percentage', 'count'];
  ftext = 'Total';
  total: number[] = [];

  minAge: number | null = null;
  maxAge: number | null = null;

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.voterreports.length) {
      this.drawCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('voterregistryreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    let path = 'voterregistryreport';
    const params: string[] = [];

    if (this.minAge !== null && this.minAge !== undefined) {
      params.push(`min=${this.minAge}`);
    }
    if (this.maxAge !== null && this.maxAge !== undefined) {
      params.push(`max=${this.maxAge}`);
    }
    if (params.length) {
      path += '?' + params.join('&');
    }

    const result = await this.rs.getCountReport(path);
    this.applyResult(result);
  }

  clearFilter(): void {
    this.minAge = null;
    this.maxAge = null;
    this.loadData();
  }

  private applyResult(result: countreport[]): void {
    this.voterreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.voterreports);
  }

  private ageRangeSize = 10; // change to whatever band width you want

  private groupIntoAgeRanges(reports: countreport[]): { labels: string[], counts: number[], percentages: number[] } {
    const buckets = new Map<string, { count: number, percentage: number }>();

    reports.forEach(r => {
      const age = parseInt(r.name, 10); // "25 years" -> 25
      if (isNaN(age)) return;

      const rangeStart = Math.floor(age / this.ageRangeSize) * this.ageRangeSize;
      const rangeEnd = rangeStart + this.ageRangeSize - 1;
      const label = `${rangeStart}-${rangeEnd}`;

      const existing = buckets.get(label) || { count: 0, percentage: 0 };
      existing.count += r.count;
      existing.percentage += r.percentage;
      buckets.set(label, existing);
    });

    const sortedLabels = Array.from(buckets.keys()).sort((a, b) => {
      return parseInt(a.split('-')[0], 10) - parseInt(b.split('-')[0], 10);
    });

    return {
      labels: sortedLabels,
      counts: sortedLabels.map(l => buckets.get(l)!.count),
      percentages: sortedLabels.map(l => Math.round(buckets.get(l)!.percentage * 100) / 100)
    };
  }

  drawCharts(): void {
    const { labels, counts, percentages } = this.groupIntoAgeRanges(this.voterreports);

    new Chart(this.columnchart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Voters', data: counts },
          { label: 'Percentage', data: percentages }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Voter Age Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Age Range' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    });

    new Chart(this.piechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Voters', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Voter Age Report (Pie Chart)' }
        }
      }
    });
  }
}
