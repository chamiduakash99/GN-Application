import {Employee} from "./employee";

export class Announcement{

  public id !: number;
  public title !: string;
  public content !: string;
  public isactive !: number;
  public publishedat !: string;
  public expiredat !: string;
  public employee !: Employee;


  constructor(id:number, title:string, content:string,
              isactive:number, publishedat:string, expiredat:string,
              employee:Employee) {

    this.id=id;
    this.title=title;
    this.content=content;
    this.isactive=isactive;
    this.publishedat=publishedat;
    this.expiredat=expiredat;
    this.employee=employee;
  }

}
