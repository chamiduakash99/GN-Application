import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreecuttingPortalComponent } from './treecutting-portal.component';

describe('TreecuttingPortalComponent', () => {
  let component: TreecuttingPortalComponent;
  let fixture: ComponentFixture<TreecuttingPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreecuttingPortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreecuttingPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
