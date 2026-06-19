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
import { CountByStreetMaterial } from './report/entity/countbystreetmaterial';
import { CountByStreetMaterialComponent } from './report/view/countbystreetmaterial/countbystreetmaterial.component';

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
      {path:"reports", component: CountByStreetMaterialComponent},
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



    ]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
