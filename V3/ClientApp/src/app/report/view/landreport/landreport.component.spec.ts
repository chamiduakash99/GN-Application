import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandreportComponent } from './landreport.component';

describe('LandreportComponent', () => {
  let component: LandreportComponent;
  let fixture: ComponentFixture<LandreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
