import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenreportComponent } from './citizenreport.component';

describe('CitizenreportComponent', () => {
  let component: CitizenreportComponent;
  let fixture: ComponentFixture<CitizenreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
