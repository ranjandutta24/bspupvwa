import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempTrendReportComponent } from './temp-trend-report.component';

describe('TempTrendReportComponent', () => {
  let component: TempTrendReportComponent;
  let fixture: ComponentFixture<TempTrendReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempTrendReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempTrendReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
