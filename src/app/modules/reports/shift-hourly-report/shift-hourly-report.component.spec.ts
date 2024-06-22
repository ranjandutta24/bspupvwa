import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftHourlyReportComponent } from './shift-hourly-report.component';

describe('ShiftHourlyReportComponent', () => {
  let component: ShiftHourlyReportComponent;
  let fixture: ComponentFixture<ShiftHourlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftHourlyReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftHourlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
