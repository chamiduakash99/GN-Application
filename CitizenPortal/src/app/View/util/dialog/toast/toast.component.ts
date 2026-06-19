import {AfterViewInit, Component, ElementRef, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./toast.component.css']
})


export class ToastComponent implements AfterViewInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ToastComponent>,
    private el: ElementRef
  ) {}

  ngAfterViewInit(): void {
    const duration = this.data?.duration ?? 3000;

    // 🔥 Set CSS variable dynamically
    const delay = (duration - 500) / 1000 + 's'; // subtract fadeOut time
    this.el.nativeElement
      .querySelector('.toast-container')
      .style.setProperty('--toast-delay', delay);

    // close dialog after full duration
    setTimeout(() => this.dialogRef.close(), duration);
  }
}
