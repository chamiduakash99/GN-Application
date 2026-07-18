import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterregistryComponent } from './voterregistry.component';

describe('VoterregistryComponent', () => {
  let component: VoterregistryComponent;
  let fixture: ComponentFixture<VoterregistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoterregistryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterregistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
