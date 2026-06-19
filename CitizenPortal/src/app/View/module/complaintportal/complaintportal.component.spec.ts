import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintportalComponent } from './complaintportal.component';

describe('ComplaintportalComponent', () => {
  let component: ComplaintportalComponent;
  let fixture: ComponentFixture<ComplaintportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintportalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
