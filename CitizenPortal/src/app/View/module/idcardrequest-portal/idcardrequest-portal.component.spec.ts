import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardrequestPortalComponent } from './idcardrequest-portal.component';

describe('IdcardrequestPortalComponent', () => {
  let component: IdcardrequestPortalComponent;
  let fixture: ComponentFixture<IdcardrequestPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdcardrequestPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcardrequestPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
