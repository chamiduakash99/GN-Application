import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreecuttingrequestComponent } from './treecuttingrequest.component';

describe('TreecuttingrequestComponent', () => {
  let component: TreecuttingrequestComponent;
  let fixture: ComponentFixture<TreecuttingrequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreecuttingrequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreecuttingrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
