import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementreportComponent } from './announcementreport.component';

describe('AnnouncementreportComponent', () => {
  let component: AnnouncementreportComponent;
  let fixture: ComponentFixture<AnnouncementreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
