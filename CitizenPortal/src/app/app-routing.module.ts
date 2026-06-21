import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./View/home/home.component";
import {MainwindowComponent} from "./View/mainwindow/mainwindow.component";
import {CertificateRequestComponent} from "./View/module/certificate-request/certificate-request.component";
import {LoginComponent} from "./View/login/login.component";
import {ComplaintComponent} from "./View/module/complaintportal/complaintportal.component";
import {IdcardrequestPortalComponent} from "./View/module/idcardrequest-portal/idcardrequest-portal.component";

const routes: Routes = [
  { path: '', redirectTo: 'main/home', pathMatch: 'full' },
  {path:"main", component:MainwindowComponent,
    children:[
      {path:"home",component:HomeComponent},
      {path: 'citizen', component: LoginComponent},
      {path: 'certificate', component: CertificateRequestComponent},
      {path: 'complaint', component: ComplaintComponent},
      { path: "idcardrequest", component: IdcardrequestPortalComponent }


    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
