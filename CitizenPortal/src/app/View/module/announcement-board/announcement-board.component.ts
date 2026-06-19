import {Component, OnInit} from '@angular/core';
import {Announcement} from "../../../entity/Announcement";
import {AnnouncementService} from "../../../service/AnnouncementService";

@Component({
  selector: 'app-announcement-board',
  templateUrl: './announcement-board.component.html',
  styleUrls: ['./announcement-board.component.css']
})

export class AnnouncementBoardComponent implements OnInit {

  announcements: Array<Announcement> = [];
  imageurl: string = '';

  constructor(private as: AnnouncementService) {
  }

  ngOnInit(): void {
    this.loadBoard();
  }

  loadBoard(): void {
    this.imageurl = 'assets/pending.gif';

    this.as.getAll("?isactive=1")
      .then((anns: Announcement[]) => {
        this.announcements = anns;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      });
  }

}
