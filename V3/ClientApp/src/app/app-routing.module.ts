import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {OperationComponent} from "./view/modules/operation/operation.component";
import {AttendanceComponent} from "./view/modules/attendance/attendance.component";
import {PaymentComponent} from "./view/modules/payment/payment.component";
import {StudentComponent} from "./view/modules/student/student.component";
import {BatchregistrationComponent} from "./view/modules/batchregistration/batchregistration.component";
import {ClassComponent} from "./view/modules/class/class.component";
import {BookdistributionComponent} from "./view/modules/bookdistribution/bookdistribution.component";
import {ItemComponent} from "./view/modules/item/item.component";
import { StreetComponent } from './view/modules/street/street.component';
import { CountByStreetMaterialComponent } from './report/view/countbystreetmaterial/countbystreetmaterial.component';
import {LandComponent} from "./view/modules/land/land.component";
import {BuildingComponent} from "./view/modules/building/building.component";
import {CitizenComponent} from "./view/modules/citizen/citizen.component";
import {CertificaterequestComponent} from "./view/modules/certificaterequest/certificaterequest.component";
import {CertificateComponent} from "./view/modules/certificate/certificate.component";
import {AnnouncementComponent} from "./view/modules/announcement/announcement.component";
import {ComplaintComponent} from "./view/modules/complaint/complaint.component";
import {IdcardrequestComponent} from "./view/modules/idcardrequest/idcardrequest.component";
import {HouseholdComponent} from "./view/modules/household/household.component";
import {TreecuttingrequestComponent} from "./view/modules/treecuttingrequest/treecuttingrequest.component";
import {VoterregistryComponent} from "./view/modules/voterregistry/voterregistry.component";
import {CultivationComponent} from "./view/modules/cultivation/cultivation.component";
import {CitizenskillComponent} from "./view/modules/citizenskill/citizenskill.component";
import {LandreportComponent} from "./report/view/landreport/landreport.component";
import {BuildingreportComponent} from "./report/view/buildingreport/buildingreport.component";
import {CitizenreportComponent} from "./report/view/citizenreport/citizenreport.component";
import {HouseholdreportComponent} from "./report/view/householdreport/householdreport.component";
import {VoterregistryreportComponent} from "./report/view/voterregistryreport/voterregistryreport.component";
import {AnnouncementreportComponent} from "./report/view/announcementreport/announcementreport.component";
import {ComplaintreportComponent} from "./report/view/complaintreport/complaintreport.component";
import {IdcardrequestreportComponent} from "./report/view/idcardrequestreport/idcardrequestreport.component";
import {CultivationreportComponent} from "./report/view/cultivationreport/cultivationreport.component";
import {HarvestreportComponent} from "./report/view/harvestreport/harvestreport.component";
import {CertificatereportComponent} from "./report/view/certificatereport/certificatereport.component";
import {CitizenskillreportComponent} from "./report/view/citizenskillreport/citizenskillreport.component";


const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path: "privilege", component: PrivilageComponent},
      {path: "operation", component: OperationComponent},
      {path:"payments",component:PaymentComponent},
      {path: "home/payments", redirectTo: 'payments', pathMatch: 'full'},
      {path:"batchregistration",component:BatchregistrationComponent},
      {path: "home/batchregistration", redirectTo: 'batchregistration', pathMatch: 'full'},
      {path:"students",component:StudentComponent},
      {path: "home/students", redirectTo: 'students', pathMatch: 'full'},
      {path:"class",component:ClassComponent},
      {path: "home/class", redirectTo: 'class', pathMatch: 'full'},
      {path:"books",component:BookdistributionComponent},
      {path: "home/books", redirectTo: 'books', pathMatch: 'full'},
      {path:"attendance",component:AttendanceComponent},
      {path: "home/attendance", redirectTo: 'attendance', pathMatch: 'full'},
      {path: "item", component: ItemComponent},
      {path: "street", component: StreetComponent},
      {path: "land", component: LandComponent},
      { path: "dashboard", component: HomeComponent },
      { path: "building", component: BuildingComponent },
      { path: "citizen", component: CitizenComponent },
      { path: "certificaterequest", component: CertificaterequestComponent },
      { path: "certificate", component: CertificateComponent },
      { path: "announcement", component: AnnouncementComponent },
      { path: "complaint", component: ComplaintComponent },
      { path: "idcardrequest", component: IdcardrequestComponent },
      { path: "household", component: HouseholdComponent },
      { path: "treecuttingrequest", component: TreecuttingrequestComponent },
      { path: "voterregistry", component: VoterregistryComponent },
      { path: "cultivation", component: CultivationComponent },
      { path: "citizenskill", component: CitizenskillComponent },
      {path: "reports",
        children: [
          { path: "countbystreetmaterial", component: CountByStreetMaterialComponent },
          { path: "landreport", component: LandreportComponent },
          { path: "buildingreport", component: BuildingreportComponent },
          { path: "citizenreport", component: CitizenreportComponent },
          { path: "householdreport", component: HouseholdreportComponent },
          { path: "voterregistryreport", component: VoterregistryreportComponent },
          { path: "citizenskillreport", component: CitizenskillreportComponent },
          { path: "certificatereport", component: CertificatereportComponent },
          { path: "announcementreport", component: AnnouncementreportComponent },
          { path: "complaintreport", component: ComplaintreportComponent },
          { path: "idcardrequestreport", component: IdcardrequestreportComponent },
          { path: "cultivationreport", component: CultivationreportComponent },
          { path: "harvestreport", component: HarvestreportComponent },

        ]},

    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
