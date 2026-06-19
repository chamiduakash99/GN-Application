import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByStreetMaterial } from '../../entity/countbystreetmaterial';
import { MatTableDataSource } from '@angular/material/table';

declare var google: any;

@Component({
  selector: 'app-countbystreetmaterial',
  templateUrl: './countbystreetmaterial.component.html',
  styleUrls: ['./countbystreetmaterial.component.css']
})
export class CountByStreetMaterialComponent implements OnInit {

  countByStreetMaterials!: CountByStreetMaterial[];
  data!: MatTableDataSource<CountByStreetMaterial>;

  columns: string[] = ['streetMaterial', 'count', 'percentage'];
  headers: string[] = ['Street Material', 'Count', 'Percentage'];
  binders: string[] = ['streetMaterial', 'count', 'percentage'];

  ftext = 'Total';
  total: number[] = [];

  @ViewChild('columnchart', { static: false }) columnchart: any;
  @ViewChild('barchart', { static: false }) barchart!: ElementRef;
  @ViewChild('piechart', { static: false }) piechart!: ElementRef;
  @ViewChild('linechart', { static: false }) linechart!: ElementRef;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    // --- Static Mock Data (Like ArrearsByProgram Example) ---
    let asphalt = new CountByStreetMaterial(1, "Asphalt", 5, 0);
    let concrete = new CountByStreetMaterial(2, "Concrete", 4, 0);
    let gravel = new CountByStreetMaterial(3, "Gravel", 4, 0);
    let tar = new CountByStreetMaterial(4, "Soil", 4, 0);
    let unpaved = new CountByStreetMaterial(5, "Interlock Blocks", 3, 0);

    // --- Total Calculation ---
    let totalCount = asphalt.count + concrete.count + gravel.count + tar.count + unpaved.count;

    // --- Calculate Percentage for Each ---
    asphalt.percentage = Math.round((asphalt.count / totalCount) * 100);
    concrete.percentage = Math.round((concrete.count / totalCount) * 100);
    gravel.percentage = Math.round((gravel.count / totalCount) * 100);
    tar.percentage = Math.round((tar.count / totalCount) * 100);
    unpaved.percentage = Math.round((unpaved.count / totalCount) * 100);

    // --- Assign Data ---
    this.total = [totalCount];
    this.countByStreetMaterials = [asphalt, concrete, gravel, tar, unpaved];

    // --- Load Table and Charts ---
    this.loadTable();
    this.loadCharts();
  }

  calculateTotals(): void {
    const totalCount = this.countByStreetMaterials.reduce((sum, item) => sum + item.count, 0);
    this.total = [totalCount];
  }

  loadTable(): void {
    this.data = new MatTableDataSource(this.countByStreetMaterials);
  }


  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }

  drawCharts(): void {
    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'Street Material');
    barData.addColumn('number', 'Count');
    barData.addColumn('number', 'Percentage');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'Street Material');
    pieData.addColumn('number', 'Count');
    pieData.addColumn('number', 'Percentage');

    this.countByStreetMaterials.forEach((sm: CountByStreetMaterial) => {
      barData.addRow([sm.streetMaterial, sm.count, sm.percentage]);
      pieData.addRow([sm.streetMaterial, sm.count, sm.percentage]);
    });

    const barOptions = {
      title: 'Street Material Report (Bar Chart)',
      subtitle: 'Count and Percentage of Streets by Material',
      bars: 'vertical',
      height: 400,
      width: 600,
      legend: { position: 'top', alignment: 'center' },
      vAxis: { title: 'Values' },
      hAxis: { title: 'Street Material' }
    };

    const pieOptions = {
      title: 'Street Material Report (Pie Chart)',
      height: 400,
      width: 550,
      pieHole: 0.3
    };

    const columnChart = new google.visualization.ColumnChart(this.columnchart.nativeElement);
    columnChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);
  }

}
