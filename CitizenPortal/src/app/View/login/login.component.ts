import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CitizenService} from "../service/CitizenService";
import {Citizen} from "../entity/Citizen";
import {MatDialog} from "@angular/material/dialog";
import {ToastComponent} from "../util/dialog/toast/toast.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  userType: string = 'adult'; // default selection

  loginForm: FormGroup;
  citizens: Citizen[] = [];

  constructor(private fb: FormBuilder,private citizenService:CitizenService,private dg:MatDialog,private router:Router) {

    this.loginForm = this.fb.group({



      // Adult fields
      fullname: [''],
      nic: [''],

      // Child field
      birthcert: ['']

    });

  }

  ngOnInit(): void {

    this.initialize();

  }

  initialize(){
    this.citizenService.getAllListNameId().then((c:Citizen[])=>{

      this.citizens = c;
    })
  }
  // 🔥 Called when user clicks login button
  login() {

    if (this.userType === 'adult') {

      if (
        !this.loginForm.value.fullname ||
        !this.loginForm.value.nic
      ) {
        alert('Please fill all Adult required fields');
        return;
      }

      if (!this.checkCredentials(this.loginForm.value.fullname,this.loginForm.value.nic)){
        this.dg.open(ToastComponent, {
          data: {
            heading: 'User Login',
            message: "Wrong Credentials!",
            type: 'error'
          },
          panelClass: 'transparent-dialog', // optional
          hasBackdrop: false,
          disableClose: true
        });
        return;
      }
      const citizen = this.citizens.find((c:Citizen) => { return c.nic === this.loginForm.value.nic} )
      console.log(citizen);
      localStorage.setItem("citizen",JSON.stringify(citizen));
      console.log('ADULT LOGIN DATA:', this.loginForm.value);
      this.dg.open(ToastComponent, {
        data: {
          heading: 'User Login',
          message: "Login Successfully!",
          type: 'info'
        },
        panelClass: 'transparent-dialog', // optional
        hasBackdrop: false,
        disableClose: true
      });
      this.router.navigate(['/main/certificate']);

    } else {

      if (
        !this.loginForm.value.fullname ||
        !this.loginForm.value.birthcert
      ) {
        alert('Please fill all Child required fields');
        return;
      }
      if (!this.checkCredentials(this.loginForm.value.fullname,'',this.loginForm.value.birthcert)){
        this.dg.open(ToastComponent, {
          data: {
            heading: 'User Login',
            message: "Wrong Credentials!",
            type: 'error'
          },
          panelClass: 'transparent-dialog', // optional
          hasBackdrop: false,
          disableClose: true
        });
        return;
      }
      const citizen = this.citizens.find((c:Citizen) => { return c.birthcetificateno === this.loginForm.value.birthcert} )
      console.log(citizen);
      localStorage.setItem("citizen",JSON.stringify(citizen));
      console.log('CHILD LOGIN DATA:', this.loginForm.value);
      this.dg.open(ToastComponent, {
        data: {
          heading: 'User Login',
          message: "Login Successfully!",
          type: 'info'
        },
        panelClass: 'transparent-dialog', // optional
        hasBackdrop: false,
        disableClose: true
      });
      this.router.navigate(['/main/certificate']);
    }

    // 🔥 Here you will later call backend API
    // this.authService.login(this.loginForm.value)
  }
  checkCredentials(name:string,nic?:string,bcet?:string) : boolean{

    if (name && nic){
      const exists = this.citizens.some(citizen =>
        citizen.nic === nic && citizen.name === name
      );
      return exists;
    }
    if (name && bcet){
      const exists = this.citizens.some(citizen =>
        citizen.birthcetificateno === bcet && citizen.name === name
      );
      return exists;
    }
    return false;
  }
  selectType(type: string) {

    this.userType = type;

    // clear fields when switching
    this.loginForm.patchValue({
      fullname: '',
      nic: '',
      birthcert: ''
    });

  }
}
