import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';
import {UserService} from "./userservice";
import {jwtDecode} from "jwt-decode";
import {AnnouncementComponent} from "../view/modules/announcement/announcement.component";

@Injectable()
export class AuthorizationManager {

  public imageempurl!: string;

  private readonly localStorageUsreName = 'username';
  private readonly localStorageAdminMenus = 'admMenuState';
  private readonly localStorageInventoryMenus = 'invMenuState';

  Admin = [
    { name: 'Employee',displayName: 'Employee', isVisible: false, routerLink: 'employee' },
    { name: 'User',displayName: 'User', isVisible: false, routerLink: 'user' },
    { name: 'Privilege',displayName: 'Privilage', isVisible: false, routerLink: 'privilege' },
    { name: 'Operation',displayName: 'Operation', isVisible: false, routerLink: 'operation' }
  ];

  Infrastructure = [
    {name: 'Street',displayName: 'Street', isVisible: false, routerLink: 'street'},
    {name: 'Land',displayName: 'Land', isVisible: false, routerLink: 'land'},
    {name: 'Building',displayName: 'Building', isVisible: false, routerLink: 'building'}
  ]
  Citizen = [
    {name: 'Citizen',displayName: 'Citizen', isVisible: false, routerLink: 'citizen'},
    {name: 'Household',displayName: 'Household', isVisible: false, routerLink: 'household'},
    {name: 'VoterRegistry',displayName: 'Voter Registry', isVisible: false, routerLink: 'voterregistry'},
    {name: 'CitizenSkill',displayName: 'Citizen Skill', isVisible: false, routerLink: 'citizenskill'}
  ]

  CertificateRequest = [
    {name: 'CertificateRequest',displayName: 'Certificate Request',  isVisible: false, routerLink: 'certificaterequest'},
    {name: 'Certificate',displayName: 'Certificate',  isVisible: false, routerLink: 'certificate'}
  ];

  TreeCuttingRequest = [
    {name: 'TreeCuttingRequest',displayName: 'Tree Cutting Request',  isVisible: false, routerLink: 'treecuttingrequest'}
  ];

  Cultivation = [
    {name: 'Cultivation',displayName: 'Cultivation', isVisible: false, routerLink: 'cultivation'}
  ]

  Announcement = [
    {name: 'Announcement',displayName: 'Announcement',  isVisible: false, routerLink: 'announcement'}
  ];

  Complaint = [
    {name: 'Complaint',displayName: 'Complaint',  isVisible: false, routerLink: 'complaint'}
  ];

  IdCardRequest = [
    {name: 'IdCardRequest',displayName: 'Id Card Request',  isVisible: false, routerLink: 'idcardrequest'}
  ];

  Reports = [
    {name: 'CountByStreetMaterial', displayName: 'Street Report', isVisible: false, routerLink: 'reports/countbystreetmaterial'},
    {name: 'landreport', displayName: 'Land Report', isVisible: false, routerLink: 'reports/landreport'},
    {name: 'buildingreport', displayName: 'Building Report', isVisible: false, routerLink: 'reports/buildingreport'},
    {name: 'citizenreport', displayName: 'Citizen Report', isVisible: false, routerLink: 'reports/citizenreport'},
    {name: 'householdreport', displayName: 'Household Report', isVisible: false, routerLink: 'reports/householdreport'},
    {name: 'voterregistryreport', displayName: 'Voter Registry Report', isVisible: false, routerLink: 'reports/voterregistryreport'},
    {name: 'announcementreport', displayName: 'Announcement Report', isVisible: false, routerLink: 'reports/announcementreport'},
    {name: 'complaintreport', displayName: 'Complaint Report', isVisible: false, routerLink: 'reports/complaintreport'},
    {name: 'idcardrequestreport', displayName: 'ID Card Request Report', isVisible: false, routerLink: 'reports/idcardrequestreport'},
  ];



  getNavListItem(){
    return [
      { Menu : 'Admin' ,displayName: 'Admin', MenuItems : this.Admin, direct:false  },
      { Menu : 'Infrastructure' ,displayName: 'Infrastructure', MenuItems : this.Infrastructure, direct:false  },
      { Menu : 'Citizen' ,displayName: 'Citizen', MenuItems : this.Citizen, direct:false  },
      { Menu : 'CertificateRequest' ,displayName: 'Certificate Request', MenuItems : this.CertificateRequest, direct:false  },
      { Menu : 'TreeCuttingRequest' ,displayName: 'Tree Cutting Request', MenuItems : this.TreeCuttingRequest, direct:true },
      { Menu : 'Announcement' ,displayName: 'Announcement', MenuItems : this.Announcement, direct:true },
      { Menu : 'Complaint' ,displayName: 'Complaint', MenuItems : this.Complaint, direct:true },
      { Menu : 'IdCardRequest' ,displayName: 'Id Card Request', MenuItems : this.IdCardRequest, direct:true },
      { Menu : 'Cultivation' ,displayName: 'Cultivation', MenuItems : this.Cultivation, direct:true },
      { Menu : 'Reports' ,displayName: 'Reports', MenuItems : this.Reports, direct:false  }


    ]
  }


  constructor(private us:UserService) {}



  enableMenus(modules: { module: string; operation: string }[]): void {
    const menus = this.getNavListItem();

    menus.forEach(menuGroup => {
      menuGroup.MenuItems.forEach(menuItem => {
        if (menuGroup.Menu === 'Reports') {
          menuItem.isVisible = true; // reports are read-only, no privilege gating needed
        } else {
          menuItem.isVisible = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
        }
      });
    });

    menus.forEach(menuGroup => {
      // @ts-ignore
      localStorage.setItem(this["localStorage" + menuGroup.Menu + "Menus"], JSON.stringify(menuGroup));
    });
  }
  // enableMenus(modules: { module: string; operation: string }[]): void {
  //
  //   const menus = this.getNavListItem();
  //
  //   menus.forEach(menuGroup => {
  //     menuGroup.MenuItems.forEach(menuItem => {
  //       menuItem.isVisible = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
  //     });
  //   });
  //
  //   menus.forEach(menuGroup => {
  //     // @ts-ignore
  //     localStorage.setItem(this["localStorage" + menuGroup.Menu + "Menus"], JSON.stringify(menuGroup));
  //   });
  //
  // }

  async getAuth(username: string): Promise<void> {

    this.setUsername(username);

    try {
      const authoritiesArray = this.getAuthorities();


      const employee = await this.us.getEmployeeByUserName(username);

      this.setEmployee(employee);
      this.setUserProfile();

      if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
        const authorities = this.extractAuthorities(authoritiesArray);
        this.enableMenus(authorities);
      } else {
        console.log('Authorities are undefined or not an array');
      }

    } catch (error) {
      console.error(error);
    }
  }


  extractAuthorities(authoritiesArray: string[]): { module: string; operation: string }[] {
    return authoritiesArray.map(authority => {
      const [module, operation] = authority.split('-');
      return { module: module.toLowerCase(), operation: operation.toLowerCase() };
    });
  }
  // extractAuthorities(authoritiesArray: string[]): { module: string; operation: string }[] {
  //   return authoritiesArray.map(authority => {
  //     const [module, operation] = authority.split('-');
  //     return { module, operation };
  //   });
  // }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUsreName) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUsreName, value);
  }

  setEmployee(employee: any): void {
    localStorage.setItem('employee', JSON.stringify(employee));
  }

  setUserProfile(): void {
    const employee = localStorage.getItem('employee');
    if (employee) {
      try {
        const img = JSON.parse(employee).photo;
        this.imageempurl = atob(img);
      } catch (error) {
        //console.error("Error decoding employee photo:", error);
        this.imageempurl = "assets/default.png";
      }
    }
  }

  getAuthorities(){
    // @ts-ignore
    const jwtToken = localStorage.getItem("Authorization").split(' ')[1];
    return jwtDecode(jwtToken).aud;
  }

  getUserProfile(): string {
    return this.imageempurl;
  }

  initializeMenuState(): void {

    const menus = this.getNavListItem();

    menus.forEach(menuState => {
      // @ts-ignore
      const localStorageState = localStorage.getItem(this['localStorage' + menuState.Menu + 'Menus']);
      if (localStorageState) {
        menuState.Menu = JSON.parse(localStorageState);
      }
    });
  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUsreName);
  }

  clearMenuState(): void {
    const menus = this.getNavListItem();
    menus.forEach(menu => {
      // @ts-ignore
      localStorage.removeItem(this['localStorage' + menu.Menu + 'Menus']);
    });
  }


}
