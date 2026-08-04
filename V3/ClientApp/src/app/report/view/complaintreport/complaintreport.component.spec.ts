import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintreportComponent } from './complaintreport.component';

describe('ComplaintreportComponent', () => {
  let component: ComplaintreportComponent;
  let fixture: ComponentFixture<ComplaintreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
