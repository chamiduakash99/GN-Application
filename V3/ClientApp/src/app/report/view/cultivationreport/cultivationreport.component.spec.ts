import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CultivationreportComponent } from './cultivationreport.component';

describe('CultivationreportComponent', () => {
  let component: CultivationreportComponent;
  let fixture: ComponentFixture<CultivationreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CultivationreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CultivationreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
