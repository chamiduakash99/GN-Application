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
  countByStreetMaterials: countreport[] = [];
  data!: MatTableDataSource<countreport>;
  columns: string[] = ['name', 'percentage', 'count'];
  headers: string[] = ['Street Material', 'Percentage', 'Count'];
  binders: string[] = ['name', 'percentage', 'count'];
  ftext = 'Total';
  total: number[] = [];

  private viewReady = false;

  @ViewChild('columnchart', { static: false }) columnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.countByStreetMaterials.length) {
      this.drawCharts();
    }
  }

  async loadData(): Promise<void> {
    const result = await this.rs.getCountReport('countbystreetmaterial');
    this.countByStreetMaterials = result;
    this.total = [result.reduce((sum, item) => sum + item.count, 0)];
    this.loadTable();
    if (this.viewReady) {
      this.drawCharts();
    }
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.countByStreetMaterials);
  }

  drawCharts(): void {
    const labels = this.countByStreetMaterials.map(sm => sm.name);
    const counts = this.countByStreetMaterials.map(sm => sm.count);
    const percentages = this.countByStreetMaterials.map(sm => sm.percentage);

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
          title: { display: true, text: 'Street Material Report (Bar Chart)' },
          legend: { position: 'top' }
        },
        scales: {
          x: { title: { display: true, text: 'Street Material' } },
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
          title: { display: true, text: 'Street Material Report (Pie Chart)' }
        }
      }
    });
  }
}
