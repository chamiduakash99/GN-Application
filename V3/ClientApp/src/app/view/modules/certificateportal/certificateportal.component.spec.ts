import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateportalComponent } from './certificateportal.component';

describe('CertificateportalComponent', () => {
  let component: CertificateportalComponent;
  let fixture: ComponentFixture<CertificateportalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateportalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateportalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
