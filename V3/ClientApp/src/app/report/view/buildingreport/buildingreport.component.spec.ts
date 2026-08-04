import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingreportComponent } from './buildingreport.component';

describe('BuildingreportComponent', () => {
  let component: BuildingreportComponent;
  let fixture: ComponentFixture<BuildingreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
