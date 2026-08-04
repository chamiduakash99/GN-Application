import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdreportComponent } from './householdreport.component';

describe('HouseholdreportComponent', () => {
  let component: HouseholdreportComponent;
  let fixture: ComponentFixture<HouseholdreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HouseholdreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
