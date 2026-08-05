import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestreportComponent } from './harvestreport.component';

describe('HarvestreportComponent', () => {
  let component: HarvestreportComponent;
  let fixture: ComponentFixture<HarvestreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarvestreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarvestreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
