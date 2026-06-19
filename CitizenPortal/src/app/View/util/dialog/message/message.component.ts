import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-dialog',
  templateUrl: './message.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatDialogModule,
    MatButtonModule
  ],
  styleUrls: ['./message.component.css']
})
export class MessageComponent {

  lines?: [];

  constructor(public dialogRef: MatDialogRef<MessageComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.lines = this.data.message.split('<br>').filter((line: string) => line !== '');

  }

  ngOnInit(): void { this.dialogRef.addPanelClass('custom-dialog'); }

  onNoClick(): void { this.dialogRef.close(); }

}
