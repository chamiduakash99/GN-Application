import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent implements OnInit{

  btnenable = true;
  constructor(private router:Router) {
  }
  protected readonly localStorage = localStorage;

  logout() {
    localStorage.removeItem('citizen');
    this.router.navigate(['/main/home']);
    this.btnenable = false;

  }

  ngOnInit(): void {
    this.btnenable =  localStorage.getItem('citizen') != '';
  }
}


// import {Component, OnInit} from '@angular/core';
// import {Router} from "@angular/router";
//
// @Component({
//   selector: 'app-mainwindow',
//   templateUrl: './mainwindow.component.html',
//   styleUrls: ['./mainwindow.component.css']
// })
// export class MainwindowComponent implements OnInit{
//
//   btnenable = true;
//   constructor(private router:Router) {
//   }
//     protected readonly localStorage = localStorage;
//
//   logout() {
//     localStorage.removeItem('citizen');
//     this.router.navigate(['/main/home']);
//     this.btnenable = false;
//
//   }
//
//   ngOnInit(): void {
//   this.btnenable =  localStorage.getItem('citizen') != '';
//   }
// }
