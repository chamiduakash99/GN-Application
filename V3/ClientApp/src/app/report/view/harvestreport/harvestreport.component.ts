import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {HttpClient} from '@angular/common/http';
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-harvestreport',
  templateUrl: './harvestreport.component.html',
  styleUrls: ['./harvestreport.component.css']
})
export class HarvestreportComponent implements OnInit, AfterViewInit {

  harvestreports: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count', 'value'];
  headers: string[] = ['Month', 'Percentage', 'Harvest Count', 'Total Quantity'];
  binders: string[] = ['name', 'percentage', 'count', 'value'];
  ftext = 'Total';
  total: number[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;
  minQty: number | null = null;
  maxQty: number | null = null;
  cropTypeId: number | null = null;
  croptypes: any[] = [];

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8080/croptypes/list')
      .toPromise().then(r => this.croptypes = r ?? []).catch(() => this.croptypes = []);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.harvestreports.length) {
      this.drawCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('harvestreport');
    this.applyResult(result);
  }

  async applyFilter(): Promise<void> {
    const params: string[] = [];

    if (this.cropTypeId !== null && this.cropTypeId !== undefined) {
      params.push(`cropTypeId=${this.cropTypeId}`);
    }
    if (this.startDate) {
      params.push(`start=${this.formatDate(this.startDate)}`);
    }
    if (this.endDate) {
      params.push(`end=${this.formatDate(this.endDate)}`);
    }
    if (this.minQty !== null && this.minQty !== undefined) {
      params.push(`minQty=${this.minQty}`);
    }
    if (this.maxQty !== null && this.maxQty !== undefined) {
      params.push(`maxQty=${this.maxQty}`);
    }

    let path = 'harvestreport';
    if (params.length) {
      path += '?' + params.join('&');
    }

    const result = await this.rs.getCountReport(path);
    this.applyResult(result);
  }

  clearFilter(): void {
    this.cropTypeId = null;
    this.startDate = null;
    this.endDate = null;
    this.minQty = null;
    this.maxQty = null;
    this.loadData();
  }

  private formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private applyResult(result: countreport[]): void {
    this.harvestreports = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();

    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.harvestreports);
  }

  drawCharts(): void {

    this.destroyCharts();
    const labels = this.harvestreports.map(sm => sm.name);
    const counts = this.harvestreports.map(sm => sm.count);
    const percentages = this.harvestreports.map(sm => sm.percentage);

    this.track(new Chart(this.columnchart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Harvest Count', data: counts },
          { label: 'Percentage', data: percentages }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Harvest Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Month' } },
          y: { title: { display: true, text: 'Values' }, beginAtZero: true }
        }
      }
    }));

    this.track(new Chart(this.piechart.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ label: 'Harvest Count', data: counts }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Harvest Report (Pie Chart)' }
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
