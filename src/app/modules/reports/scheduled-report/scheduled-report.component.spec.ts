import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledReportComponent } from './scheduled-report.component';

describe('ScheduledReportComponent', () => {
  let component: ScheduledReportComponent;
  let fixture: ComponentFixture<ScheduledReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduledReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
