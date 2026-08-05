import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenskillreportComponent } from './citizenskillreport.component';

describe('CitizenskillreportComponent', () => {
  let component: CitizenskillreportComponent;
  let fixture: ComponentFixture<CitizenskillreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenskillreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenskillreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
