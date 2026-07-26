import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenskillComponent } from './citizenskill.component';

describe('CitizenskillComponent', () => {
  let component: CitizenskillComponent;
  let fixture: ComponentFixture<CitizenskillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitizenskillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitizenskillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
