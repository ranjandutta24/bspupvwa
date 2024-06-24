import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { MaterialModule } from "app/core/angular-material-elements/material.module";
import { DateFormat } from "app/date-format";
import { CustomDecimalPipe } from "app/pipes/custom-decimal.pipe";
import { CommonService } from "app/services/common.service";
import { ReportService } from "app/services/report.service";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-temp-trend-report",
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDecimalPipe,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: "./temp-trend-report.component.html",
  styleUrl: "./temp-trend-report.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DateAdapter, useClass: DateFormat }, DatePipe],
})
export class TempTrendReportComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";

  filterJson = {
    sDate: new Date(),
    eDate: new Date(),
    startTime: "06:00",
    endTime: this.getCurrentTimeIn12HourFormat(),
  };
  start = "";
  end = "";
  loading = false;
  filteredData = [];
  tempTrendReport = { details: [], filters: { furnace: [] } };
  detailsReport = [];
  furnaces = [];
  plannedSizes = [];

  furnace_checkedItems: string[] = [];
  pl_checkedItems: string[] = [];
  max: boolean = false;
  min: boolean = false;
  filter35: boolean = false;
  filter140: boolean = false;
  filter160: boolean = false;
  filter110: boolean = false;
  filter180: boolean = false;
  filter140_2: boolean = false;

  tableHead = [
    { name: "Sl" },
    { name: "COILID" },
    { name: "SLABID" },
    { name: "GRADE" },
    { name: "FUR NO" },
    {
      name: "SLAB_THCK",
      arrowDownward: true,
      showBtn: false,
      attr: "THCK_TOLR",
    },
    { name: "SLAB_WDTH" },
    { name: "SLAB_LNTH" },
    { name: "SLAB_WT" },
    { name: "R5_TEMP_MIN" },
    { name: "R5_TEMP_MAX" },
    { name: "R5_TEMP_AVG" },
    { name: "RMTEMP_PEAKDIF" },
    { name: "FM_EN_TEMP" },
    { name: "FM_TEMP1" },
    { name: "FM_TEMP2" },
    { name: "FM_TEMP3" },
    { name: "FM_TEMP4" },
    { name: "FM_TEMP5" },
    { name: "FM_TEMP6" },
    { name: "FM_TEMP7" },
    { name: "FM_EX_TEMP" },
    { name: "FIN_TEMP_MIN" },
    { name: "FIN_TEMP_MAX" },
    { name: "FMTEMP_PEAKDIFF" },
    { name: "FIN_TEMP_AVG" },
    { name: "FIN_TEMP_SD" },
    { name: "COIL_TEMP_MIN" },
    { name: "COIL_TEMP_MAX" },
    { name: "COIL_TEMP_AVG" },
    { name: "COIL_TEMP_SD" },
    { name: "FM_COIL_TEMP" },
    { name: "ACT_COILR_TEMP" },
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
        if (matchingAliases.includes("lg")) {
          this.drawerMode = "side";
        } else {
          this.drawerMode = "over";
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
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad minutes and seconds with leading zeros
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    const timeStr = hours + ":" + minutesStr + " " + ampm;
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
    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0; // Midnight case
    }

    // Convert hours to string with leading zero if necessary
    let hoursStr = hours.toString();
    if (hours < 10) {
      hoursStr = "0" + hours;
    }

    // Return 24-hour formatted time
    return `${hoursStr}:${minutes}`;
  }
  onFilter() {
    this.loading = true;
    let obj = {
      startDate: "",
      endDate: "",
    };
    console.log(this.filterJson.startTime);
    console.log(this.filterJson.endTime);
    this.filterJson.sDate = this.commonService.createDateAsUTC(
      this.filterJson.sDate
    );
    this.filterJson.eDate = this.commonService.createDateAsUTC(
      this.filterJson.eDate
    );
    this.start = `${this.datePipe.transform(
      this.filterJson.sDate,
      "dd/MM/yyyy"
    )} ${this.convertTo24HourFormat(this.filterJson.startTime)}`;
    this.end = `${this.datePipe.transform(
      this.filterJson.eDate,
      "dd/MM/yyyy"
    )} ${this.convertTo24HourFormat(this.filterJson.endTime)}`;
    obj["startDate"] = this.start;
    obj["endDate"] = this.end;
    console.log(obj);

    this.reportService.millTempTrendReport(obj).subscribe(
      (response) => {
        console.log(response);
        this.tempTrendReport = JSON.parse(JSON.stringify(response));
        console.log(this.tempTrendReport);
        this.detailsReport = this.tempTrendReport.details;
        this.furnaces = this.tempTrendReport.filters.furnace;
        this.filteredData = this.detailsReport;
        this.loading = false;
        this.matDrawer.close();
      },
      (respError) => {
        this.loading = false;
        this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
  }

  sortArrayByProperty(property: string, columnIndex) {
    this.tableHead[columnIndex].arrowDownward =
      !this.tableHead[columnIndex].arrowDownward;
    this.filteredData.sort((a, b) => {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });

    // console.log(this.filteredData);

    //this._changeDetectorRef.markForCheck();
  }

  sortArrayByPropertyReverse(property: string, columnIndex) {
    this.tableHead[columnIndex].arrowDownward =
      !this.tableHead[columnIndex].arrowDownward;

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
  }

  localFilter() {
    this.filteredData = this.detailsReport.filter((item) => {
      return (
        this.furnace_checkedItems.length === 0 ||
        this.furnace_checkedItems.includes(item.CHRGD_FUR_NO)
      );
    });
    // if (this.filter35) {
    //   this.filteredData = this.filteredData.filter((item) => {
    //     return item.RMTEMP_PEAKDIF && item.RMTEMP_PEAKDIF < 35;
    //   });
    // }
    // if (this.filter140) {
    //   console.log("f");

    //   this.filteredData = this.filteredData.filter((item) => {
    //     return item.R5_TEMP_AVG && item.R5_TEMP_AVG < 1040;
    //   });
    // }
    this.tempFilter(this.filter35, this.filter140, this.filter160);
    this.tempFilter2(this.filter110, this.filter140_2, this.filter180);
    if (this.min) {
      this.getItemsWithMinR5TmpAvg("min");
    } else if (this.max) {
      this.getItemsWithMinR5TmpAvg("max");
    }

    this.updateAvailableOptions();
  }

  maxValue(fn){
    if(fn==0){
      return Math.max(...this.filteredData.map(item => item.R5_TMP_AVG));
    }
    else{
      const filtered = this.filteredData.filter(item => item.CHRGD_FUR_NO === fn);
      if (filtered.length === 0) {
          return 0; 
      }
      return Math.max(...filtered.map(item => item.R5_TMP_AVG));
    }
  }
  minValue(fn){
    if(fn==0){
      const filtered = this.filteredData.filter(item =>item.R5_TMP_AVG!=null);
  
      return Math.min(...filtered.map(item => item.R5_TMP_AVG));
      
    }
    else{
      const filtered = this.filteredData.filter(item => item.CHRGD_FUR_NO === fn && item.R5_TMP_AVG!=null);
      if (filtered.length === 0) {

          return 0; 
      }
      return Math.min(...filtered.map(item => item.R5_TMP_AVG));
    }
  }

  filter35percent(fn) {
    let len = this.filteredData.filter((item) => {
      return (
        item.RMTEMP_PEAKDIF &&
        item.RMTEMP_PEAKDIF < 35 &&
        item.CHRGD_FUR_NO == fn
      );
    }).length;

    let tlen = this.detailsReport.filter((item) => {
      return item.CHRGD_FUR_NO == fn;
    }).length;
    return ((len / tlen) * 100).toFixed(2);
  }
  filter35percentTotal() {
    let len = this.filteredData.filter((item) => {
      return (
        item.RMTEMP_PEAKDIF &&
        item.RMTEMP_PEAKDIF < 35 
      );
    }).length;

    let tlen = this.detailsReport.length;
    return ((len / tlen) * 100).toFixed(2);
  }



  filter1040percent(fn) {
    if(fn==0){
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG && item.R5_TMP_AVG > 1040 
        );
      }).length;
  
      let tlen = this.detailsReport.length;
      return ((len / tlen) * 100).toFixed(2);

    }
    else{
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG && item.R5_TMP_AVG > 1040 && item.CHRGD_FUR_NO == fn
        );
      }).length;
  
      let tlen = this.detailsReport.filter((item) => {
        return item.CHRGD_FUR_NO == fn;
      }).length;
      return ((len / tlen) * 100).toFixed(2);

    }
  }

  filter1060percent(fn) {
    if(fn==0){
      
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG &&
          item.R5_TMP_AVG > 1060
        );
      }).length;
  
      let tlen = this.detailsReport.length;
      return ((len / tlen) * 100).toFixed(2);
    }
    else{
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG &&
          // item.R5_TMP_AVG > 1040 &&
          item.R5_TMP_AVG > 1060 &&
          item.CHRGD_FUR_NO == fn
        );
      }).length;
  
      let tlen = this.detailsReport.filter((item) => {
        return item.CHRGD_FUR_NO == fn;
      }).length;
      return ((len / tlen) * 100).toFixed(2);

    }
  }
  filter1010percent(fn) {
  if(fn==0){
    let len = this.filteredData.filter((item) => {
      return (
        item.R5_TMP_AVG && item.R5_TMP_AVG > 1100
      );
    }).length;
    let tlen = this.detailsReport.length;
    let result = len + " | "+ tlen 
    return result;

  }
else{
    let len = this.filteredData.filter((item) => {
      return (
        item.R5_TMP_AVG && item.R5_TMP_AVG > 1100 && item.CHRGD_FUR_NO == fn
      );
    }).length;
    
    let tlen = this.detailsReport.filter((item) => {
      return item.CHRGD_FUR_NO == fn;
    }).length;
    let result = len + " | "+ tlen 
    return result;
  }
  }
  filter1040_2percent(fn) {

    if(fn==0){
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG &&
          item.R5_TMP_AVG < 1040
        );
      }).length;
  
      let tlen = this.detailsReport.length;
      let result = len + " | "+ tlen 
      return result;
    }
    else{
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG &&
          item.R5_TMP_AVG < 1040 &&
          item.CHRGD_FUR_NO == fn
        );
      }).length;
  
      let tlen = this.detailsReport.filter((item) => {
        return item.CHRGD_FUR_NO == fn;
      }).length;
      let result = len + " | "+ tlen 
      return result;
    }
  }

  filter1080percent(fn) {
    if(fn==0){
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG &&
          item.R5_TMP_AVG > 1080
        );
      }).length;
  
      let tlen = this.detailsReport.length;
      let result = len + " | "+ tlen 
      return result;
    }
    else{
      let len = this.filteredData.filter((item) => {
        return (
          item.R5_TMP_AVG &&
          item.R5_TMP_AVG > 1080 &&
          item.CHRGD_FUR_NO == fn
        );
      }).length;
  
      let tlen = this.detailsReport.filter((item) => {
        return item.CHRGD_FUR_NO == fn;
      }).length;
      let result = len + " | "+ tlen 
      return result;
    }
  }

  tempFilter(f35, f1040, f1060) {
    if (f35 || f1040 || f1060) {
      this.filteredData = this.filteredData.filter((item) => {
        return (
          (f35 && item.RMTEMP_PEAKDIF && item.RMTEMP_PEAKDIF < 35) ||
          (f1040 && item.R5_TMP_AVG && item.R5_TMP_AVG > 1040) ||
          (f1060 &&
            item.R5_TMP_AVG &&
            item.R5_TMP_AVG > 1060 )
        );
      });
    } else {
      return;
    }
  }
  tempFilter2(f1010, f1040, f1080) {
    if (f1010 || f1040 || f1080) {
      this.filteredData = this.filteredData.filter((item) => {
        return (
          (f1010 && item.R5_TMP_AVG && item.R5_TMP_AVG > 1100) ||
          (f1040 &&
            item.R5_TMP_AVG &&
            item.R5_TMP_AVG < 1040) ||
          (f1080 &&
            item.R5_TMP_AVG &&
            
            item.R5_TMP_AVG > 1080)
        );
      });
    } else {
      return;
    }
  }
  getItemsWithMinR5TmpAvg(mode) {
    // Initialize an object to store the minimum R5_TMP_AVG item for each CHRGD_FUR_NO
    const r5TmpAvgItemsPerFurnace = {};

    this.filteredData.forEach((record) => {
      const furnaceNo = record.CHRGD_FUR_NO;
      const r5TmpAvg = record.R5_TMP_AVG;

      // Skip if R5_TMP_AVG is null
      if (r5TmpAvg === null || r5TmpAvg === undefined) {
        return;
      }

      if (!(furnaceNo in r5TmpAvgItemsPerFurnace)) {
        r5TmpAvgItemsPerFurnace[furnaceNo] = record;
      } else {
        if (
          mode === "min" &&
          r5TmpAvg < r5TmpAvgItemsPerFurnace[furnaceNo].R5_TMP_AVG
        ) {
          r5TmpAvgItemsPerFurnace[furnaceNo] = record;
        } else if (
          mode === "max" &&
          r5TmpAvg > r5TmpAvgItemsPerFurnace[furnaceNo].R5_TMP_AVG
        ) {
          r5TmpAvgItemsPerFurnace[furnaceNo] = record;
        }
      }
    });

    // Convert the result object to an array
    this.filteredData = Object.values(r5TmpAvgItemsPerFurnace);
    console.log(this.filteredData);
  }

  filterCount(item, attr) {
    // return this.filteredData.length;
    return this.filteredData.filter((i) => i[attr] == item).length;
  }

  updateAvailableOptions(): void {
    const availableFurnaces = new Set(
      this.filteredData.map((item) => item.CHRGD_FUR_NO)
    );

    this.furnaces = Array.from(availableFurnaces);
  }

  isChecked(item: string): boolean {
    return this.furnace_checkedItems.includes(item);
  }

  onCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.furnace_checkedItems.push(item);
    } else {
      const index = this.furnace_checkedItems.indexOf(item);
      if (index >= 0) {
        this.furnace_checkedItems.splice(index, 1);
      }
    }
    this.localFilter();
    console.log(this.furnace_checkedItems);
  }
  // isCheckedMax(item: string): boolean {
  //   return this.furnace_checkedItems.includes(item);
  // }

  onCheckboxChangeMin(event: any): void {
    if (event.checked) {
      this.min = true;
    } else {
      this.min = false;
    }
    this.localFilter();
  }
  onCheckboxChangeMax(event: any): void {
    if (event.checked) {
      this.max = true;
    } else {
      this.max = false;
    }
    this.localFilter();
  }
  onCheckboxChange35(event: any): void {
    if (event.checked) {
      this.filter35 = true;
    } else {
      this.filter35 = false;
    }
    this.localFilter();
  }
  onCheckboxChange140(event: any): void {
    if (event.checked) {
      this.filter140 = true;
    } else {
      this.filter140 = false;
    }
    this.localFilter();
  }
  onCheckboxChange160(event: any): void {
    if (event.checked) {
      this.filter160 = true;
    } else {
      this.filter160 = false;
    }
    this.localFilter();
  }

  onCheckboxChange110(event: any): void {
    if (event.checked) {
      this.filter110 = true;
    } else {
      this.filter110 = false;
    }
    this.localFilter();
  }
  onCheckboxChange140_2(event: any): void {
    if (event.checked) {
      this.filter140_2 = true;
    } else {
      this.filter140_2 = false;
    }
    this.localFilter();
  }
  onCheckboxChange180(event: any): void {
    if (event.checked) {
      this.filter180 = true;
    } else {
      this.filter180 = false;
    }
    this.localFilter();
  }
}
