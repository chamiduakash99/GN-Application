import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {Chart} from "chart.js/auto";
import {countreport} from "../../entity/countreport";

@Component({
  selector: 'app-citizenreport',
  templateUrl: './citizenreport.component.html',
  styleUrls: ['./citizenreport.component.css']
})
export class CitizenreportComponent implements OnInit, AfterViewInit {

  // ---- Religion ----
  religionreports: countreport[] = [];
  religionData!: MatTableDataSource<countreport>;
  religionColumns: string[] = ['name', 'percentage', 'count'];
  religionHeaders: string[] = ['Religion', 'Percentage', 'Count'];
  religionBinders: string[] = ['name', 'percentage', 'count'];
  religionTotal: number[] = [];

  // ---- Marital Status ----
  matiralstatusreports: countreport[] = [];
  matiralstatusData!: MatTableDataSource<countreport>;
  matiralstatusColumns: string[] = ['name', 'percentage', 'count'];
  matiralstatusHeaders: string[] = ['Marital Status', 'Percentage', 'Count'];
  matiralstatusBinders: string[] = ['name', 'percentage', 'count'];
  matiralstatusTotal: number[] = [];

  // ---- Education Level ----
  educationlevelreports: countreport[] = [];
  educationlevelData!: MatTableDataSource<countreport>;
  educationlevelColumns: string[] = ['name', 'percentage', 'count'];
  educationlevelHeaders: string[] = ['Education Level', 'Percentage', 'Count'];
  educationlevelBinders: string[] = ['name', 'percentage', 'count'];
  educationlevelTotal: number[] = [];

  // ---- Ethnicity ----
  ethnicityreports: countreport[] = [];
  ethnicityData!: MatTableDataSource<countreport>;
  ethnicityColumns: string[] = ['name', 'percentage', 'count'];
  ethnicityHeaders: string[] = ['Ethnicity', 'Percentage', 'Count'];
  ethnicityBinders: string[] = ['name', 'percentage', 'count'];
  ethnicityTotal: number[] = [];

  // ---- Gender ----
  genderreports: countreport[] = [];
  genderData!: MatTableDataSource<countreport>;
  genderColumns: string[] = ['name', 'percentage', 'count'];
  genderHeaders: string[] = ['Gender', 'Percentage', 'Count'];
  genderBinders: string[] = ['name', 'percentage', 'count'];
  genderTotal: number[] = [];

  // ---- Citizen Status ----
  citizenstatusreports: countreport[] = [];
  citizenstatusData!: MatTableDataSource<countreport>;
  citizenstatusColumns: string[] = ['name', 'percentage', 'count'];
  citizenstatusHeaders: string[] = ['Citizen Status', 'Percentage', 'Count'];
  citizenstatusBinders: string[] = ['name', 'percentage', 'count'];
  citizenstatusTotal: number[] = [];

  // ---- Aid Program ----
  aidprogramreports: countreport[] = [];
  aidprogramData!: MatTableDataSource<countreport>;
  aidprogramColumns: string[] = ['name', 'percentage', 'count'];
  aidprogramHeaders: string[] = ['Aid Program', 'Percentage', 'Count'];
  aidprogramBinders: string[] = ['name', 'percentage', 'count'];
  aidprogramTotal: number[] = [];

  ftext = 'Total';
  private viewReady = false;

  @ViewChild('religioncolumnchart', { static: false }) religioncolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('religionpiechart', { static: false }) religionpiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('matiralstatuscolumnchart', { static: false }) matiralstatuscolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('matiralstatuspiechart', { static: false }) matiralstatuspiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('educationlevelcolumnchart', { static: false }) educationlevelcolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('educationlevelpiechart', { static: false }) educationlevelpiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ethnicitycolumnchart', { static: false }) ethnicitycolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ethnicitypiechart', { static: false }) ethnicitypiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gendercolumnchart', { static: false }) gendercolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genderpiechart', { static: false }) genderpiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('citizenstatuscolumnchart', { static: false }) citizenstatuscolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('citizenstatuspiechart', { static: false }) citizenstatuspiechart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('aidprogramcolumnchart', { static: false }) aidprogramcolumnchart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('aidprogrampiechart', { static: false }) aidprogrampiechart!: ElementRef<HTMLCanvasElement>;

  constructor(private rs: ReportService) { }

  ngOnInit(): void {
    this.loadReligionData();
    this.loadMatiralstatusData();
    this.loadEducationlevelData();
    this.loadEthnicityData();
    this.loadGenderData();
    this.loadCitizenstatusData();
    this.loadAidprogramData();
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.religionreports.length) this.drawReligionCharts();
    if (this.matiralstatusreports.length) this.drawMatiralstatusCharts();
    if (this.educationlevelreports.length) this.drawEducationlevelCharts();
    if (this.ethnicityreports.length) this.drawEthnicityCharts();
    if (this.genderreports.length) this.drawGenderCharts();
    if (this.citizenstatusreports.length) this.drawCitizenstatusCharts();
    if (this.aidprogramreports.length) this.drawAidprogramCharts();
  }

  // ---- Religion ----
  async loadReligionData(): Promise<void> {
    const result = await this.rs.getCountReport('religionreport');
    this.religionreports = result;
    this.religionTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.religionData = new MatTableDataSource(this.religionreports);
    if (this.viewReady) this.drawReligionCharts();
  }

  drawReligionCharts(): void {
    const labels = this.religionreports.map(sm => sm.name);
    const counts = this.religionreports.map(sm => sm.count);
    const percentages = this.religionreports.map(sm => sm.percentage);

    new Chart(this.religioncolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Religion Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Religion' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.religionpiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Religion Report (Pie Chart)' } } }
    });
  }

  // ---- Marital Status ----
  async loadMatiralstatusData(): Promise<void> {
    const result = await this.rs.getCountReport('matiralstatusreport');
    this.matiralstatusreports = result;
    this.matiralstatusTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.matiralstatusData = new MatTableDataSource(this.matiralstatusreports);
    if (this.viewReady) this.drawMatiralstatusCharts();
  }

  drawMatiralstatusCharts(): void {
    const labels = this.matiralstatusreports.map(sm => sm.name);
    const counts = this.matiralstatusreports.map(sm => sm.count);
    const percentages = this.matiralstatusreports.map(sm => sm.percentage);

    new Chart(this.matiralstatuscolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Marital Status Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Marital Status' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.matiralstatuspiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Marital Status Report (Pie Chart)' } } }
    });
  }

  // ---- Education Level ----
  async loadEducationlevelData(): Promise<void> {
    const result = await this.rs.getCountReport('educationlevelreport');
    this.educationlevelreports = result;
    this.educationlevelTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.educationlevelData = new MatTableDataSource(this.educationlevelreports);
    if (this.viewReady) this.drawEducationlevelCharts();
  }

  drawEducationlevelCharts(): void {
    const labels = this.educationlevelreports.map(sm => sm.name);
    const counts = this.educationlevelreports.map(sm => sm.count);
    const percentages = this.educationlevelreports.map(sm => sm.percentage);

    new Chart(this.educationlevelcolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Education Level Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Education Level' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.educationlevelpiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Education Level Report (Pie Chart)' } } }
    });
  }

  // ---- Ethnicity ----
  async loadEthnicityData(): Promise<void> {
    const result = await this.rs.getCountReport('ethnicityreport');
    this.ethnicityreports = result;
    this.ethnicityTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.ethnicityData = new MatTableDataSource(this.ethnicityreports);
    if (this.viewReady) this.drawEthnicityCharts();
  }

  drawEthnicityCharts(): void {
    const labels = this.ethnicityreports.map(sm => sm.name);
    const counts = this.ethnicityreports.map(sm => sm.count);
    const percentages = this.ethnicityreports.map(sm => sm.percentage);

    new Chart(this.ethnicitycolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Ethnicity Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Ethnicity' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.ethnicitypiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Ethnicity Report (Pie Chart)' } } }
    });
  }

  // ---- Gender ----
  async loadGenderData(): Promise<void> {
    const result = await this.rs.getCountReport('genderreport');
    this.genderreports = result;
    this.genderTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.genderData = new MatTableDataSource(this.genderreports);
    if (this.viewReady) this.drawGenderCharts();
  }

  drawGenderCharts(): void {
    const labels = this.genderreports.map(sm => sm.name);
    const counts = this.genderreports.map(sm => sm.count);
    const percentages = this.genderreports.map(sm => sm.percentage);

    new Chart(this.gendercolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Gender Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Gender' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.genderpiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Gender Report (Pie Chart)' } } }
    });
  }

  // ---- Citizen Status ----
  async loadCitizenstatusData(): Promise<void> {
    const result = await this.rs.getCountReport('citizenstatusreport');
    this.citizenstatusreports = result;
    this.citizenstatusTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.citizenstatusData = new MatTableDataSource(this.citizenstatusreports);
    if (this.viewReady) this.drawCitizenstatusCharts();
  }

  drawCitizenstatusCharts(): void {
    const labels = this.citizenstatusreports.map(sm => sm.name);
    const counts = this.citizenstatusreports.map(sm => sm.count);
    const percentages = this.citizenstatusreports.map(sm => sm.percentage);

    new Chart(this.citizenstatuscolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Citizen Status Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Citizen Status' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.citizenstatuspiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Citizen Status Report (Pie Chart)' } } }
    });
  }

  // ---- Aid Program ----
  async loadAidprogramData(): Promise<void> {
    const result = await this.rs.getCountReport('aidprogramreport');
    this.aidprogramreports = result;
    this.aidprogramTotal = [result.reduce((sum, item) => sum + item.count, 0)];
    this.aidprogramData = new MatTableDataSource(this.aidprogramreports);
    if (this.viewReady) this.drawAidprogramCharts();
  }

  drawAidprogramCharts(): void {
    const labels = this.aidprogramreports.map(sm => sm.name);
    const counts = this.aidprogramreports.map(sm => sm.count);
    const percentages = this.aidprogramreports.map(sm => sm.percentage);

    new Chart(this.aidprogramcolumnchart.nativeElement, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Count', data: counts }, { label: 'Percentage', data: percentages }] },
      options: {
        responsive: true,
        plugins: { title: { display: true, text: 'Aid Program Report (Bar Chart)' }, legend: { position: 'top' } },
        scales: { x: { title: { display: true, text: 'Aid Program' } }, y: { title: { display: true, text: 'Values' }, beginAtZero: true } }
      }
    });

    new Chart(this.aidprogrampiechart.nativeElement, {
      type: 'pie',
      data: { labels, datasets: [{ label: 'Count', data: counts }] },
      options: { responsive: true, plugins: { title: { display: true, text: 'Aid Program Report (Pie Chart)' } } }
    });
  }
}
