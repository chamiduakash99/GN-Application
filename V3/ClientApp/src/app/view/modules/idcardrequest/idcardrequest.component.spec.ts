import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardrequestComponent } from './idcardrequest.component';

describe('IdcardrequestComponent', () => {
  let component: IdcardrequestComponent;
  let fixture: ComponentFixture<IdcardrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdcardrequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcardrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
