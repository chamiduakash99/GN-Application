import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatereportComponent } from './certificatereport.component';

describe('CertificatereportComponent', () => {
  let component: CertificatereportComponent;
  let fixture: ComponentFixture<CertificatereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificatereportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
