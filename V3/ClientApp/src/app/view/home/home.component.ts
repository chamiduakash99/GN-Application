import {Component, OnInit} from '@angular/core';
import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {AnnouncementService} from '../../service/announcementservice';
import {Announcement} from '../../entity/announcement';

export interface ChartStat {
  label: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private readonly base = 'http://localhost:8080/dashboard';

  // ── Top summary counts ────────────────────────────────────────────────────
  totalCitizens: number = 0;
  totalHouseholds: number = 0;
  totalVoters: number = 0;
  totalLands: number = 0;
  totalBuildings: number = 0;
  totalAnnouncements: number = 0;

  // ── Announcements ─────────────────────────────────────────────────────────
  announcements: Announcement[] = [];

  // ── Loading flags ─────────────────────────────────────────────────────────
  loadingCertReq: boolean = true;
  loadingComplaints: boolean = true;
  loadingIdCard: boolean = true;
  loadingTree: boolean = true;
  loadingCultivation: boolean = true;

  // ── Mini stat chips (label + count + color), derived from chart data ─────
  certReqStats: ChartStat[] = [];
  idCardStats: ChartStat[] = [];
  treeStats: ChartStat[] = [];

  // ══════════════════════════════════════════════════════════════════════════
  // CHART 1 — Certificate Requests (Doughnut)
  // ══════════════════════════════════════════════════════════════════════════
  certReqChartType: 'doughnut' = 'doughnut';
  certReqColors: string[] = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'];
  certReqChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: this.certReqColors,
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
  certReqChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {display: false},
      title: {display: false}
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CHART 2 — Complaints (Bar)
  // ══════════════════════════════════════════════════════════════════════════
  complaintChartType: ChartType = 'bar';
  complaintChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Complaints',
      data: [],
      backgroundColor: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.1,       // smaller = thinner bars
      categoryPercentage: 0.6
    }]
  };
  complaintChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {legend: {display: false}},
    scales: {
      y: {beginAtZero: true, ticks: {stepSize: 1}},
      x: {grid: {display: false}}
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CHART 3 — ID Card Requests (Doughnut)
  // ══════════════════════════════════════════════════════════════════════════
  idCardChartType: 'doughnut' = 'doughnut';
  idCardColors: string[] = ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6'];
  idCardChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: this.idCardColors,
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  };
  idCardChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {display: false}
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CHART 4 — Tree Cutting Requests (Doughnut)
  // ══════════════════════════════════════════════════════════════════════════
  treeChartType: 'doughnut' = 'doughnut';
  treeColors: string[] = ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#84cc16'];
  treeChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: this.treeColors,
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };
  treeChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {display: false}
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // CHART 5 — Cultivation Status (Bar)
  // ══════════════════════════════════════════════════════════════════════════
  cultivationChartType: ChartType = 'bar';
  cultivationChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Cultivations',
      data: [],
      backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16'],
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.5,       // smaller = thinner bars
      categoryPercentage: 0.6
    }]
  };
  cultivationChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {legend: {display: false}},
    scales: {
      y: {beginAtZero: true, ticks: {stepSize: 1}},
      x: {grid: {display: false}}
    }
  };

  constructor(
    private http: HttpClient,
    private announcementService: AnnouncementService
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadAnnouncements();
    this.loadCertRequestChart();
    this.loadComplaintChart();
    this.loadIdCardChart();
    this.loadTreeChart();
    this.loadCultivationChart();
  }

  // ── Helper: zip labels/counts/colors into mini stat chips ─────────────────
  private buildStats(labels: string[], data: number[], colors: string[]): ChartStat[] {
    return labels.map((label, i) => ({
      label,
      count: data[i],
      color: colors[i % colors.length]
    }));
  }

  // ── Loaders ───────────────────────────────────────────────────────────────
  loadSummary(): void {
    firstValueFrom(this.http.get<any>(`${this.base}/summary`))
      .then((data: any) => {
        this.totalCitizens      = data.totalCitizens      ?? 0;
        this.totalHouseholds    = data.totalHouseholds    ?? 0;
        this.totalVoters        = data.totalVoters        ?? 0;
        this.totalLands         = data.totalLands         ?? 0;
        this.totalBuildings     = data.totalBuildings     ?? 0;
        this.totalAnnouncements = data.totalAnnouncements ?? 0;
      }).catch(() => {});
  }

  loadAnnouncements(): void {
    this.announcementService.getAll('?isactive=1')
      .then((data: Announcement[]) => {
        // Show only the 5 most recent active announcements
        this.announcements = data.slice(0, 5);
      }).catch(() => {});
  }

  loadCertRequestChart(): void {
    firstValueFrom(this.http.get<any[]>(`${this.base}/certificaterequests/summary`))
      .then((data: any[]) => {
        const labels = data.map((d: any) => d.status);
        const counts = data.map((d: any) => d.count);

        this.certReqChartData = {
          labels,
          datasets: [{
            data: counts,
            backgroundColor: this.certReqColors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        };
        this.certReqStats = this.buildStats(labels, counts, this.certReqColors);
        this.loadingCertReq = false;
      }).catch(() => { this.loadingCertReq = false; });
  }

  loadComplaintChart(): void {
    firstValueFrom(this.http.get<any[]>(`${this.base}/complaints/summary`))
      .then((data: any[]) => {
        this.complaintChartData = {
          labels: data.map((d: any) => d.status),
          datasets: [{
            label: 'Complaints',
            data: data.map((d: any) => d.count),
            backgroundColor: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }]
        };
        this.loadingComplaints = false;
      }).catch(() => { this.loadingComplaints = false; });
  }

  loadIdCardChart(): void {
    firstValueFrom(this.http.get<any[]>(`${this.base}/idcardrequests/summary`))
      .then((data: any[]) => {
        const labels = data.map((d: any) => d.status);
        const counts = data.map((d: any) => d.count);

        this.idCardChartData = {
          labels,
          datasets: [{
            data: counts,
            backgroundColor: this.idCardColors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        };
        this.idCardStats = this.buildStats(labels, counts, this.idCardColors);
        this.loadingIdCard = false;
      }).catch(() => { this.loadingIdCard = false; });
  }

  loadTreeChart(): void {
    firstValueFrom(this.http.get<any[]>(`${this.base}/treecuttingrequests/summary`))
      .then((data: any[]) => {
        const labels = data.map((d: any) => d.status);
        const counts = data.map((d: any) => d.count);

        this.treeChartData = {
          labels,
          datasets: [{
            data: counts,
            backgroundColor: this.treeColors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        };
        this.treeStats = this.buildStats(labels, counts, this.treeColors);
        this.loadingTree = false;
      }).catch(() => { this.loadingTree = false; });
  }

  loadCultivationChart(): void {
    firstValueFrom(this.http.get<any[]>(`${this.base}/cultivations/summary`))
      .then((data: any[]) => {
        this.cultivationChartData = {
          labels: data.map((d: any) => d.status),
          datasets: [{
            label: 'Cultivations',
            data: data.map((d: any) => d.count),
            backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16'],
            borderRadius: 6,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.6
          }]
        };
        this.loadingCultivation = false;
      }).catch(() => { this.loadingCultivation = false; });
  }
}

// import {Component, OnInit} from '@angular/core';
// import {ChartConfiguration, ChartData, ChartType} from 'chart.js';
// import {HttpClient} from '@angular/common/http';
// import {firstValueFrom} from 'rxjs';
// import {AnnouncementService} from '../../service/announcementservice';
// import {Announcement} from '../../entity/announcement';
//
//
// @Component({
//   selector: 'app-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css']
// })
// export class HomeComponent implements OnInit {
//
//   private readonly base = 'http://localhost:8080/dashboard';
//
//   // ── Top summary counts ────────────────────────────────────────────────────
//   totalCitizens: number = 0;
//   totalHouseholds: number = 0;
//   totalVoters: number = 0;
//   totalLands: number = 0;
//   totalBuildings: number = 0;
//   totalAnnouncements: number = 0;
//
//   // ── Announcements ─────────────────────────────────────────────────────────
//   announcements: Announcement[] = [];
//
//   // ── Loading flags ─────────────────────────────────────────────────────────
//   loadingCertReq: boolean = true;
//   loadingComplaints: boolean = true;
//   loadingIdCard: boolean = true;
//   loadingTree: boolean = true;
//   loadingCultivation: boolean = true;
//
//   // ══════════════════════════════════════════════════════════════════════════
//   // CHART 1 — Certificate Requests (Doughnut)
//   // ══════════════════════════════════════════════════════════════════════════
//   certReqChartType: 'doughnut' = 'doughnut';
//   certReqChartData: ChartData<'doughnut'> = {
//     labels: [],
//     datasets: [{
//       data: [],
//       backgroundColor: ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'],
//       borderWidth: 2,
//       borderColor: '#ffffff'
//     }]
//   };
//   certReqChartOptions: ChartConfiguration<'doughnut'>['options'] = {
//     responsive: true,
//     cutout: '60%',
//     plugins: {
//       legend: {position: 'bottom', labels: {font: {size: 11}}},
//       title: {display: false}
//     }
//   };
//   // certReqChartOptions: ChartConfiguration['options'] = {
//   //   responsive: true,
//   //   cutout: '75%',
//   //   plugins: {
//   //     legend: {position: 'bottom', labels: {font: {size: 11}}},
//   //     title: {display: false}
//   //   }
//   // };
//
//   // ══════════════════════════════════════════════════════════════════════════
//   // CHART 2 — Complaints (Bar)
//   // ══════════════════════════════════════════════════════════════════════════
//   complaintChartType: ChartType = 'bar';
//   complaintChartData: ChartData<'bar'> = {
//     labels: [],
//     datasets: [{
//       label: 'Complaints',
//       data: [],
//       backgroundColor: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
//       borderRadius: 6,
//       borderSkipped: false,
//       barPercentage: 0.1,       // smaller = thinner bars
//       categoryPercentage: 0.6
//     }]
//   };
//   complaintChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     plugins: {legend: {display: false}},
//     scales: {
//       y: {beginAtZero: true, ticks: {stepSize: 1}},
//       x: {grid: {display: false}}
//     }
//   };
//
//   // ══════════════════════════════════════════════════════════════════════════
//   // CHART 3 — ID Card Requests (Doughnut)
//   // ══════════════════════════════════════════════════════════════════════════
//   idCardChartType: 'doughnut' = 'doughnut';
//   idCardChartData: ChartData<'doughnut'> = {
//     labels: [],
//     datasets: [{
//       data: [],
//       backgroundColor: ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6'],
//       borderWidth: 2,
//       borderColor: '#ffffff',
//
//     }]
//   };
//   idCardChartOptions: ChartConfiguration<'doughnut'>['options'] = {
//     responsive: true,
//     cutout: '60%',
//     plugins: {
//       legend: {position: 'bottom', labels: {font: {size: 11}}}
//     }
//   };
//   // idCardChartOptions: ChartConfiguration['options'] = {
//   //   responsive: true,
//   //   cutout: '75%',
//   //   plugins: {
//   //     legend: {position: 'bottom', labels: {font: {size: 11}}}
//   //   }
//   // };
//
//   // ══════════════════════════════════════════════════════════════════════════
//   // CHART 4 — Tree Cutting Requests (Doughnut)
//   // ══════════════════════════════════════════════════════════════════════════
//   treeChartType: 'doughnut' = 'doughnut';
//   treeChartData: ChartData<'doughnut'> = {
//     labels: [],
//     datasets: [{
//       data: [],
//       backgroundColor: ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#84cc16'],
//       borderWidth: 2,
//       borderColor: '#ffffff'
//     }]
//   };
//   treeChartOptions: ChartConfiguration<'doughnut'>['options'] = {
//     responsive: true,
//     cutout: '60%',
//     plugins: {
//       legend: {position: 'bottom', labels: {font: {size: 11}}}
//     }
//   };
//   // treeChartOptions: ChartConfiguration['options'] = {
//   //   responsive: true,
//   //   cutout: '75%',
//   //   plugins: {
//   //     legend: {position: 'bottom', labels: {font: {size: 11}}}
//   //   }
//   // };
//
//   // ══════════════════════════════════════════════════════════════════════════
//   // CHART 5 — Cultivation Status (Bar)
//   // ══════════════════════════════════════════════════════════════════════════
//   cultivationChartType: ChartType = 'bar';
//   cultivationChartData: ChartData<'bar'> = {
//     labels: [],
//     datasets: [{
//       label: 'Cultivations',
//       data: [],
//       backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16'],
//       borderRadius: 6,
//       borderSkipped: false,
//       barPercentage: 0.5,       // smaller = thinner bars
//       categoryPercentage: 0.6
//     }]
//   };
//   cultivationChartOptions: ChartConfiguration['options'] = {
//     responsive: true,
//     plugins: {legend: {display: false}},
//     scales: {
//       y: {beginAtZero: true, ticks: {stepSize: 1}},
//       x: {grid: {display: false}}
//     }
//   };
//
//   constructor(
//     private http: HttpClient,
//     private announcementService: AnnouncementService
//   ) {}
//
//   ngOnInit(): void {
//     this.loadSummary();
//     this.loadAnnouncements();
//     this.loadCertRequestChart();
//     this.loadComplaintChart();
//     this.loadIdCardChart();
//     this.loadTreeChart();
//     this.loadCultivationChart();
//   }
//
//   // ── Loaders ───────────────────────────────────────────────────────────────
//   loadSummary(): void {
//     firstValueFrom(this.http.get<any>(`${this.base}/summary`))
//       .then((data: any) => {
//         this.totalCitizens      = data.totalCitizens      ?? 0;
//         this.totalHouseholds    = data.totalHouseholds    ?? 0;
//         this.totalVoters        = data.totalVoters        ?? 0;
//         this.totalLands         = data.totalLands         ?? 0;
//         this.totalBuildings     = data.totalBuildings     ?? 0;
//         this.totalAnnouncements = data.totalAnnouncements ?? 0;
//       }).catch(() => {});
//   }
//
//   loadAnnouncements(): void {
//     this.announcementService.getAll('?isactive=1')
//       .then((data: Announcement[]) => {
//         // Show only the 5 most recent active announcements
//         this.announcements = data.slice(0, 5);
//       }).catch(() => {});
//   }
//
//   loadCertRequestChart(): void {
//     firstValueFrom(this.http.get<any[]>(`${this.base}/certificaterequests/summary`))
//       .then((data: any[]) => {
//         this.certReqChartData = {
//           labels: data.map((d: any) => d.status),
//           datasets: [{
//             data: data.map((d: any) => d.count),
//             backgroundColor: ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6'],
//             borderWidth: 2,
//             borderColor: '#ffffff'
//           }]
//         };
//         this.loadingCertReq = false;
//       }).catch(() => { this.loadingCertReq = false; });
//   }
//
//   loadComplaintChart(): void {
//     firstValueFrom(this.http.get<any[]>(`${this.base}/complaints/summary`))
//       .then((data: any[]) => {
//         this.complaintChartData = {
//           labels: data.map((d: any) => d.status),
//           datasets: [{
//             label: 'Complaints',
//             data: data.map((d: any) => d.count),
//             backgroundColor: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
//             borderRadius: 6,
//             borderSkipped: false,
//             barPercentage: 0.7,
//             categoryPercentage: 0.6
//           }]
//         };
//         this.loadingComplaints = false;
//       }).catch(() => { this.loadingComplaints = false; });
//   }
//
//   // loadComplaintChart(): void {
//   //   firstValueFrom(this.http.get<any[]>(`${this.base}/complaints/summary`))
//   //     .then((data: any[]) => {
//   //       this.complaintChartData = {
//   //         labels: data.map((d: any) => d.status),
//   //         datasets: [{
//   //           label: 'Complaints',
//   //           data: data.map((d: any) => d.count),
//   //           backgroundColor: ['#6366f1', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
//   //           borderRadius: 6,
//   //           borderSkipped: false
//   //         }]
//   //       };
//   //       this.loadingComplaints = false;
//   //     }).catch(() => { this.loadingComplaints = false; });
//   // }
//
//   loadIdCardChart(): void {
//     firstValueFrom(this.http.get<any[]>(`${this.base}/idcardrequests/summary`))
//       .then((data: any[]) => {
//         this.idCardChartData = {
//           labels: data.map((d: any) => d.status),
//           datasets: [{
//             data: data.map((d: any) => d.count),
//             backgroundColor: ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6'],
//             borderWidth: 2,
//             borderColor: '#ffffff'
//           }]
//         };
//         this.loadingIdCard = false;
//       }).catch(() => { this.loadingIdCard = false; });
//   }
//
//   loadTreeChart(): void {
//     firstValueFrom(this.http.get<any[]>(`${this.base}/treecuttingrequests/summary`))
//       .then((data: any[]) => {
//         this.treeChartData = {
//           labels: data.map((d: any) => d.status),
//           datasets: [{
//             data: data.map((d: any) => d.count),
//             backgroundColor: ['#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#84cc16'],
//             borderWidth: 2,
//             borderColor: '#ffffff'
//           }]
//         };
//         this.loadingTree = false;
//       }).catch(() => { this.loadingTree = false; });
//   }
//
//   loadCultivationChart(): void {
//     firstValueFrom(this.http.get<any[]>(`${this.base}/cultivations/summary`))
//       .then((data: any[]) => {
//         this.cultivationChartData = {
//           labels: data.map((d: any) => d.status),
//           datasets: [{
//             label: 'Cultivations',
//             data: data.map((d: any) => d.count),
//             backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16'],
//             borderRadius: 6,
//             borderSkipped: false,
//             barPercentage: 0.7,
//             categoryPercentage: 0.6
//           }]
//         };
//         this.loadingCultivation = false;
//       }).catch(() => { this.loadingCultivation = false; });
//   }
//   // loadCultivationChart(): void {
//   //   firstValueFrom(this.http.get<any[]>(`${this.base}/cultivations/summary`))
//   //     .then((data: any[]) => {
//   //       this.cultivationChartData = {
//   //         labels: data.map((d: any) => d.status),
//   //         datasets: [{
//   //           label: 'Cultivations',
//   //           data: data.map((d: any) => d.count),
//   //           backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#84cc16'],
//   //           borderRadius: 6,
//   //           borderSkipped: false
//   //         }]
//   //       };
//   //       this.loadingCultivation = false;
//   //     }).catch(() => { this.loadingCultivation = false; });
//   // }
// }
