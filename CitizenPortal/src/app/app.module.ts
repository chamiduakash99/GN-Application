import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainwindowComponent } from './View/mainwindow/mainwindow.component';
import { HomeComponent } from './View/home/home.component';
import { CertificateRequestComponent } from './View/module/certificate-request/certificate-request.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatDividerModule} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HttpClientModule} from "@angular/common/http";
import {MatDialogModule} from "@angular/material/dialog";
import {AuthorizationManager} from "./View/service/authorizationmanager";
import {CommonModule, DatePipe} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatChipsModule} from "@angular/material/chips";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AppGroupAutocompleteComponent} from "./View/util/ui/AppGroupAutocompleteComponent";
import {GetControlPipe} from "./View/util/ui/GetControlPipe";
import {MatStepperModule} from "@angular/material/stepper";
import { LoginComponent } from './View/login/login.component';
import { AnnouncementBoardComponent } from './View/module/announcement-board/announcement-board.component';
import {ComplaintComponent} from "./View/module/complaintportal/complaintportal.component";
import { IdcardrequestPortalComponent } from './View/module/idcardrequest-portal/idcardrequest-portal.component';
// import { ComplaintportalComponent } from './View/module/complaintportal/complaintportal.component';

@NgModule({
  declarations: [
    AppComponent,
    MainwindowComponent,
    HomeComponent,
    CertificateRequestComponent,
    LoginComponent,
    AnnouncementBoardComponent,
    ComplaintComponent,
    IdcardrequestPortalComponent,


  ],
  imports: [
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    MatDialogModule,
    HttpClientModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    AppGroupAutocompleteComponent,
    GetControlPipe,
    MatStepperModule,
    CommonModule,

  ],
  providers: [
    DatePipe,
    AuthorizationManager,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
