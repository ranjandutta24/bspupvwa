import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { DateFormat } from 'app/date-format';
import { CustomDecimalPipe } from 'app/pipes/custom-decimal.pipe';
import { CommonService } from 'app/services/common.service';
import { ReportService } from 'app/services/report.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shift-hourly-report',
  templateUrl: './shift-hourly-report.component.html',
  styleUrls: ['./shift-hourly-report.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DateAdapter, useClass: DateFormat }, DatePipe],
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, CustomDecimalPipe],
})
export class ShiftHourlyReportComponent {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';

  filterJson = {
    date: new Date(),
    shift: '1'
  };
  details: any = [];
  summary: any = { slabno: 0, slabwgt: 0, coilno: 0, coilwgt: 0 };
  coilbreakup: any = [];


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private reportService: ReportService,
    private commonService: CommonService,
    private dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe
  ) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }

  ngOnInit() {
    this.matDrawer.openedChange.subscribe((opened) => {
      if (!opened) {
        // Remove the selected contact when drawer closed
        //this.selectedContact = null;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      }
    });

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Set the drawerMode if the given breakpoint is active
        if (matchingAliases.includes('lg')) {
          this.drawerMode = 'side';
        }
        else {
          this.drawerMode = 'over';
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
    this.onFilter();
  }


  onFilter() {
    let obj = JSON.parse(JSON.stringify(this.filterJson))
    obj.date = this.commonService.createDateAsUTC(obj.date)
    obj.date = this.datePipe.transform(obj.date, 'dd-MM-yyyy');
    console.log(obj);
    this.reportService.shiftHourlyReport(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(response => {
        console.log(response);
        let report = JSON.parse(JSON.stringify(response));

        this.details = report.details;
        this.summary = report.summary;
        this.coilbreakup = report.coilbreakup;
        this.matDrawer.close();
      })

  }

}
