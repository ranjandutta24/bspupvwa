import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MaterialModule } from 'app/core/angular-material-elements/material.module';
import { DateFormat } from 'app/date-format';
import { CustomDecimalPipe } from 'app/pipes/custom-decimal.pipe';
import { CommonService } from 'app/services/common.service';
import { ReportService } from 'app/services/report.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-technical-prod',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, CustomDecimalPipe, NgxMaterialTimepickerModule],
  templateUrl: './technical-prod.component.html',
  styleUrl: './technical-prod.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DateAdapter, useClass: DateFormat }, DatePipe],
})
export class TechnicalProdComponent {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';

  filterJson = {
    sDate: new Date(),
    eDate: new Date(),
    startTime: '06:00',
    endTime: this.getCurrentTimeIn12HourFormat()
  };
  start = '';
  end = '';
  detailsReport = [];
  summaryData :any ;
  filteredData = []; 
  techProdReport = { details: [], summary: {} };
  loading = false;

  tableHead = [
    { name: 'No.' },
    {name: 'Type'},
    { name: 'Coil ID' },
    { name: 'Slab ID' },
    { name: 'Steelgrade' },
    { name: `Entry Thick. [mm]` },
    { name: 'Entry Width. [mm]', arrowDownward: true, showBtn: false, attr: 'THCK_TOLR' },
    { name: 'Entry Weight. [kg]' },
    { name: 'FM Thickness [mm]' },
    { name: 'FM Width [mm]', },
    { name: 'Calc. Weight [kg]' },
    { name: 'Meas Weight [kg]' },
    { name: 'Flatness [IU]' },
    { name: 'Yield[%]', },
    { name: 'Discharge Time', },
    { name: 'Prod Start Time' },
    { name: 'Prod End Time' },
    { name: 'Roll Force F1 [MN]' },
    { name: 'Roll Force F2 [MN]' },
    { name: 'Roll Force F3 [MN]' },
    { name: 'Roll Force F4 [MN]' },
    { name: 'Roll Force F5 [MN]' },
    { name: 'Roll Force F6 [MN]' },
    { name: 'Roll Force F7 [MN]' },
    {name: 'Bending F1 [MN]'},
    {name: 'Bending F2 [MN]'},
    {name: 'Bending F3 [MN]'},
    {name: 'Bending F4 [MN]'},
    {name: 'Bending F5 [MN]'},
    {name: 'Bending F6 [MN]'},
    {name: 'Bending F7 [MN]'},
    {name: 'Torque F1 [KNm]'},
    {name: 'Torque F2 [KNm]'},
    {name: 'Torque F3 [KNm]'},
    {name: 'Torque F4 [KNm]'},
    {name: 'Torque F5 [KNm]'},
    {name: 'Torque F6 [KNm]'},
    {name: 'Torque F7 [KNm]'},
    {name: 'Reduction F1 [%]'},
    {name: 'Reduction F2 [%]'},
    {name: 'Reduction F3 [%]'},
    {name: 'Reduction F4 [%]'},
    {name: 'Reduction F5 [%]'},
    {name: 'Reduction F6 [%]'},
    {name: 'Reduction F7 [%]'},
    {name: 'Temp.F1 [degC]'},
    {name: 'Temp.F2 [degC]'},
    {name: 'Temp.F3 [degC]'},
    {name: 'Temp.F4 [degC]'},
    {name: 'Temp.F5 [degC]'},
    {name: 'Temp.F6 [degC]'},
    {name: 'Temp.F7 [degC]'},
    {name: 'Entry Temp [degC]'},
    {name: 'FM Ex Temp [degC]'},
    {name: 'Coil Temp [degC]'},
    {name: 'Desc. Flow En.'},
    {name: 'Desc. Flow Ex.'},
    {name: 'Speed F1 [m/s]'},
    {name: 'Speed F2 [m/s]'},
    {name: 'Speed F3 [m/s]'},
    {name: 'Speed F4 [m/s]'},
    {name: 'Speed F5 [m/s]'},
    {name: 'Speed F6 [m/s]'},
    {name: 'Speed F7 [m/s]'},
    {name: 'Crown'},
    {name: 'Wedge'},
    {name: 'Comment'},
  ];

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
    // console.log(this.getCurrentTimeIn12HourFormat());

    this.onFilter();
  }

  getCurrentTimeIn12HourFormat() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad minutes and seconds with leading zeros
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    const timeStr = hours + ':' + minutesStr + ' ' + ampm;
    return timeStr;
  }


  convertTo24HourFormat(time12: string): string {
    // Split time into parts (e.g., ['12', '00', 'AM'])
    const parts = time12.split(/[\s:]+/);

    // Extract hours, minutes, and period
    let hours = parseInt(parts[0]);
    const minutes = parts[1];
    const period = parts[2];

    // Adjust hours for AM/PM
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0; // Midnight case
    }

    // Convert hours to string with leading zero if necessary
    let hoursStr = hours.toString();
    if (hours < 10) {
      hoursStr = '0' + hours;
    }

    // Return 24-hour formatted time
    return `${hoursStr}:${minutes}`;
  }
  onFilter() {
    this.loading = true;
    let obj = {
      startDate: '',
      endDate: ''
    };
   
    this.filterJson.sDate = this.commonService.createDateAsUTC(this.filterJson.sDate);
    this.filterJson.eDate = this.commonService.createDateAsUTC(this.filterJson.eDate);
    this.start = `${this.datePipe.transform(this.filterJson.sDate, 'dd/MM/yyyy')} ${this.convertTo24HourFormat(this.filterJson.startTime)}`;
    this.end = `${this.datePipe.transform(this.filterJson.eDate, 'dd/MM/yyyy')} ${this.convertTo24HourFormat(this.filterJson.endTime)}`;
    obj['startDate'] = this.start;
    obj['endDate'] = this.end;


    this.reportService.technicalProductionReport(obj)
      .subscribe(response => {
        console.log(response);

        this.techProdReport = JSON.parse(JSON.stringify(response));
        
        this.detailsReport = this.techProdReport.details;

        this.summaryData = this.techProdReport.summary;
       
        this.filteredData = this.detailsReport;

        this.loading = false;
        
        this.matDrawer.close();

      },
      respError => {
        this.loading = false;
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
      })
  }

  // sortArrayByProperty(property: string, columnIndex) {
  //   this.tableHead[columnIndex].arrowDownward = !this.tableHead[columnIndex].arrowDownward;
  //   this.filteredData.sort((a, b) => {
  //     if (a[property] < b[property]) {
  //       return -1;
  //     }
  //     if (a[property] > b[property]) {
  //       return 1;
  //     }
  //     return 0;
  //   });

  //   console.log(this.filteredData);


  //   //this._changeDetectorRef.markForCheck();


  // }

  // sortArrayByPropertyReverse(property: string, columnIndex) {
  //   this.tableHead[columnIndex].arrowDownward = !this.tableHead[columnIndex].arrowDownward;

  //   this.filteredData.sort((a, b) => {
  //     if (a[property] < b[property]) {
  //       return 1; // Reverse the order of comparison
  //     }
  //     if (a[property] > b[property]) {
  //       return -1; // Reverse the order of comparison
  //     }
  //     return 0;
  //   });

  //   console.log(this.filteredData);

  // }
}
