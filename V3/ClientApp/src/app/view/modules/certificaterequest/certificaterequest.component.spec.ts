import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificaterequestComponent } from './certificaterequest.component';

describe('CertificaterequestComponent', () => {
  let component: CertificaterequestComponent;
  let fixture: ComponentFixture<CertificaterequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificaterequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificaterequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
