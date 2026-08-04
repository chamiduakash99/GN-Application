import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterregistryreportComponent } from './voterregistryreport.component';

describe('VoterregistryreportComponent', () => {
  let component: VoterregistryreportComponent;
  let fixture: ComponentFixture<VoterregistryreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoterregistryreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterregistryreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
