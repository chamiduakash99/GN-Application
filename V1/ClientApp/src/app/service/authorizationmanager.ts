import { Injectable } from '@angular/core';
import { AuthoritySevice } from './authoritysevice';
import {UserService} from "./userservice";
import {jwtDecode} from "jwt-decode";

@Injectable()
export class AuthorizationManager {

  public imageempurl!: string;

  private readonly localStorageUsreName = 'username';

  // please define all local storage suitable for relevant Main Menu name like below
  // Ex : Main Menu -> Report
  //  Then LocalStorage -> 'localstorageReportMenus'

  private readonly localStorageAdminMenus = 'admMenuState';
  private readonly localStorageInventoryMenus = 'invMenuState';

  Admin = [
    { name: 'Employee', isVisible: false, routerLink: 'employee' },
    { name: 'User', isVisible: false, routerLink: 'user' },
    { name: 'Privilege', isVisible: false, routerLink: 'privilege' },
    { name: 'Operation', isVisible: false, routerLink: 'operation' }
  ];

  Inventory = [
    {name: 'Item', isVisible: false, routerLink: 'item'}
  ]
  Infrastructure = [
    {name: 'Street', isVisible: false, routerLink: 'street'}
  ]

  getNavListItem(){
    return [
      { Menu : 'Admin' , MenuItems : this.Admin },
      { Menu : 'Inventory' , MenuItems : this.Inventory },
      { Menu : 'Infrastructure' , MenuItems : this.Infrastructure },

    ]
  }


  constructor(private us:UserService) {}

  enableMenus(modules: { module: string; operation: string }[]): void {

    const menus = this.getNavListItem();

    menus.forEach(menuGroup => {
      menuGroup.MenuItems.forEach(menuItem => {
        menuItem.isVisible = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
      });
    });

    menus.forEach(menuGroup => {
      // @ts-ignore
      localStorage.setItem(this["localStorage" + menuGroup.Menu + "Menus"], JSON.stringify(menuGroup));
    });

  }

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
      return { module, operation };
    });
  }

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
