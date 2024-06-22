import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
  selector: 'app-quality-report',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, CustomDecimalPipe, NgxMaterialTimepickerModule],
  templateUrl: './quality-report.component.html',
  styleUrl: './quality-report.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DateAdapter, useClass: DateFormat }, DatePipe],
})
export class QualityReportComponent {

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';

  filterJson = {
    startDate: new Date(),
    endDate: new Date(),
    startShift: "1",
    endShift: this.getShiftValue().toString()
  };
  start = '';
  end = '';

  filteredData = [];
  cusProdReport = { details: [], filters: { destination: [], plannedSize: [] } };
  detailsReport = [];
  destinations = [];
  plannedSizes = [];
loading = false;
  ds_checkedItems: string[] = [];
  pl_checkedItems: string[] = [];

  tableHead = [
    { name: 'No.' },
    { name: 'Coil ID' },
    { name: 'Rolling Time' },
    { name: 'FCE' },
    { name: 'Steel Grade' },
    { name: 'Destination' },
    { name: `Param` },
    { name: 'R5 Temp'},
    { name: 'R5 T' },
    { name: 'R5 W' },
    { name: 'FM EX T', },
    { name: 'FM EX W' },
    { name: 'FM EX Temp' },
    { name: 'Coil Temp' },
    { name: 'Profile', },
    { name: 'Flatness',arrowDownward: true, showBtn: false, attr: 'THCK_TOLR' },
   
   
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

  getShiftValue() {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 6 && hours < 14) {
        return 1;
    } else if (hours >= 14 && hours < 22) {
        return 2;
    } else {
        return 3;
    }
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
    let obj = JSON.parse(JSON.stringify(this.filterJson));
    obj.startDate = this.commonService.createDateAsUTC(obj.startDate);
    obj.endDate = this.commonService.createDateAsUTC(obj.endDate);

    obj.startDate = this.datePipe.transform(obj.startDate, 'dd/MM/yyyy');
    obj.endDate = this.datePipe.transform(obj.endDate, 'dd/MM/yyyy');
    this.start = obj.startDate + ' (' + this.filterJson.startShift + ')';
    this.end = obj.endDate + ' (' + this.filterJson.endShift + ')';
    console.log(obj);

    this.reportService.qualityReport(obj)
      .subscribe(response => {
        console.log(response);
        this.cusProdReport = JSON.parse(JSON.stringify(response));
        console.log(this.cusProdReport);
        this.detailsReport = this.cusProdReport.details;
        this.destinations = this.cusProdReport.filters.destination;
        this.plannedSizes = this.cusProdReport.filters.plannedSize;
        this.filteredData = this.detailsReport;
        this.loading = false;
        this.matDrawer.close();
      },
      respError => {
        this.loading = false;
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
      })
  }

  sortArrayByProperty(property: string, columnIndex) {
    this.tableHead[columnIndex].arrowDownward = !this.tableHead[columnIndex].arrowDownward;
    this.filteredData.sort((a, b) => {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });

    console.log(this.filteredData);


    //this._changeDetectorRef.markForCheck();


  }

  sortArrayByPropertyReverse(property: string, columnIndex) {
    this.tableHead[columnIndex].arrowDownward = !this.tableHead[columnIndex].arrowDownward;

    this.filteredData.sort((a, b) => {
      if (a[property] < b[property]) {
        return 1; // Reverse the order of comparison
      }
      if (a[property] > b[property]) {
        return -1; // Reverse the order of comparison
      }
      return 0;
    });

    console.log(this.filteredData);


    //this._changeDetectorRef.markForCheck();


  }


  localFilter() {

    this.filteredData = this.detailsReport.filter(item => {
      return (this.ds_checkedItems.length === 0 || this.ds_checkedItems.includes(item.DEST)) &&
        (this.pl_checkedItems.length === 0 || this.pl_checkedItems.includes(item.PLANNEDSIZE))

    })
    console.log(this.filteredData);

    this.updateAvailableOptions();
  }
  filterCount(item, attr) {
    // return this.filteredData.length;
    return this.filteredData.filter((i) => i[attr] == item).length;
  }

  updateAvailableOptions(): void {
    const availableSchedulenos = new Set(this.filteredData.map(item => item.DEST));
    const availableRefnos = new Set(this.filteredData.map(item => item.PLANNEDSIZE));


    this.destinations = Array.from(availableSchedulenos);
    this.plannedSizes = Array.from(availableRefnos);

  }

  isChecked(item: string): boolean {
    return this.ds_checkedItems.includes(item);
  }

  onCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.ds_checkedItems.push(item);
    } else {
      const index = this.ds_checkedItems.indexOf(item);
      if (index >= 0) {
        this.ds_checkedItems.splice(index, 1);
      }
    }
    this.localFilter();
    console.log(this.ds_checkedItems);

  }
  plisChecked(item: string): boolean {
    return this.pl_checkedItems.includes(item);
  }

  plonCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.pl_checkedItems.push(item);
    } else {
      const index = this.pl_checkedItems.indexOf(item);
      if (index >= 0) {
        this.pl_checkedItems.splice(index, 1);
      }
    }
    this.localFilter();
    console.log(this.pl_checkedItems);

  }
}

