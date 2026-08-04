import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdcardrequestreportComponent } from './idcardrequestreport.component';

describe('IdcardrequestreportComponent', () => {
  let component: IdcardrequestreportComponent;
  let fixture: ComponentFixture<IdcardrequestreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdcardrequestreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdcardrequestreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
