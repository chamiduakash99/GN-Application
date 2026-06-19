import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainwindowComponent } from './mainwindow.component';

describe('MainwindowComponent', () => {
  let component: MainwindowComponent;
  let fixture: ComponentFixture<MainwindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainwindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainwindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
