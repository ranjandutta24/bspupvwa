import { CommonModule, DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter, provideNativeDateAdapter } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { MaterialModule } from "app/core/angular-material-elements/material.module";
import { DateFormat } from "app/date-format";
import { CustomDecimalPipe } from "app/pipes/custom-decimal.pipe";
import { CommonService } from "app/services/common.service";
import { ReportService } from "app/services/report.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-scheduled-report",
  standalone: true,
  templateUrl: "./scheduled-report.component.html",
  styleUrl: "./scheduled-report.component.scss",
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: DateAdapter, useClass: DateFormat }, DatePipe],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomDecimalPipe,
  ],
})
export class ScheduledReportComponent {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  @ViewChild("matDrawer", { static: true }) matDrawer: MatDrawer;
  drawerMode: "side" | "over";

  filterJson = {
    date: new Date(),
    shift: this.getShiftValue().toString(),
  };
  details: any = [];
  summary: any = { slabno: 0, slabwgt: 0, coilno: 0, coilwgt: 0 };
  coilbreakup: any = [];
  slabToCoilReport = {
    details: [],
    filters: {
      schedulenos: [],
      refnos: [],
      coilwidthes: [],
      coilthicknesses: [],
    },
  };

  schedulenos = [];
  refnos = [];
  coilthicknesses = [];
  coilwidthes = [];

  dataOfSlabCoil = [];
  filteredData = [];
  sh_checkedItems: string[] = [];
  rf_checkedItems: string[] = [];
  ct_checkedItems: string[] = [];
  cw_checkedItems: string[] = [];
  c = "(sa)";
  loading = false;

  tableHead = [
    { name: "No" },
    { name: "Sh. NO", arrowDownward: true, showBtn: true, attr: "SCHDL_NO" },
    { name: "Coil No." },
    { name: "S" },
    { name: "F", arrowDownward: true, showBtn: true, attr: "CHRGD_FUR_NO" },
    { name: "Tol", arrowDownward: true, showBtn: true, attr: "THCK_TOLR" },
    { name: "Th", arrowDownward: true, showBtn: true, attr: "COIL_THCK" },
    { name: "Wth", arrowDownward: true, showBtn: true, attr: "COIL_WDTH" },
    {
      name: "Side Painting",
      arrowDownward: true,
      showBtn: true,
      attr: "COIL_WDTH",
    },
    { name: "Heat No." },
    { name: "Slab ID" },
    { name: "Th", arrowDownward: true, showBtn: true, attr: "SLAB_THCK" },
    { name: "Wth", arrowDownward: true, showBtn: true, attr: "SLAB_WDTH" },
    { name: "Weight" },
    { name: "Ref No." },
    { name: "Prd." },
    { name: "Temp, Grade, %C, %Mn" },
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
    this.getdata();
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

  filterCount(item, attr) {
    // return this.filteredData.length;
    return this.filteredData.filter((i) => i[attr] == item).length;
  }
  getdata() {
    this.loading = true;
    let obj = JSON.parse(JSON.stringify(this.filterJson));
    obj.date = this.commonService.createDateAsUTC(obj.date);
    obj.date = this.datePipe.transform(obj.date, "dd-MM-yyyy");
    // obj.date = "01-06-2024"
    console.log(obj);
    this.reportService
      .rolseqReport(obj)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response) => {
        this.slabToCoilReport = JSON.parse(JSON.stringify(response));
        console.log(this.slabToCoilReport);
        this.schedulenos = this.slabToCoilReport.filters.schedulenos;
        this.refnos = this.slabToCoilReport.filters.refnos;
        this.coilthicknesses = this.slabToCoilReport.filters.coilthicknesses;
        this.coilwidthes = this.slabToCoilReport.filters.coilwidthes;
        this.dataOfSlabCoil = this.slabToCoilReport.details;
        this.filteredData = this.dataOfSlabCoil;
        this.loading = false;
        this.matDrawer.close();
      },
      respError => {
        this.loading = false;
        this.commonService.showSnakBarMessage(respError, 'error', 2000);
      });
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

    console.log(this.filteredData);

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

    //this._changeDetectorRef.markForCheck();
  }

  slabToCoilFilter() {
    this.filteredData = this.dataOfSlabCoil.filter((item) => {
      return (
        (this.sh_checkedItems.length === 0 ||
          this.sh_checkedItems.includes(item.SCHDL_NO)) &&
        (this.rf_checkedItems.length === 0 ||
          this.rf_checkedItems.includes(item.REF_NO)) &&
        (this.ct_checkedItems.length === 0 ||
          this.ct_checkedItems.includes(item.COIL_THCK)) &&
        (this.cw_checkedItems.length === 0 ||
          this.cw_checkedItems.includes(item.COIL_WDTH))
      );
    });
    console.log(this.filteredData);

    this.updateAvailableOptions();
  }

  updateAvailableOptions(): void {
    const availableSchedulenos = new Set(
      this.filteredData.map((item) => item.SCHDL_NO)
    );
    const availableRefnos = new Set(
      this.filteredData.map((item) => item.REF_NO)
    );
    const availableCoilthicknesses = new Set(
      this.filteredData.map((item) => item.COIL_THCK)
    );
    const availableCoilwidthes = new Set(
      this.filteredData.map((item) => item.COIL_WDTH)
    );

    this.schedulenos = Array.from(availableSchedulenos);
    this.refnos = Array.from(availableRefnos);
    this.coilthicknesses = Array.from(availableCoilthicknesses);
    this.coilwidthes = Array.from(availableCoilwidthes);
  }

  isChecked(item: string): boolean {
    return this.sh_checkedItems.includes(item);
  }

  onCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.sh_checkedItems.push(item);
    } else {
      const index = this.sh_checkedItems.indexOf(item);
      if (index >= 0) {
        this.sh_checkedItems.splice(index, 1);
      }
    }
    this.slabToCoilFilter();
    console.log(this.sh_checkedItems);
  }
  ctisChecked(item: string): boolean {
    return this.ct_checkedItems.includes(item);
  }

  ctonCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.ct_checkedItems.push(item);
    } else {
      const index = this.ct_checkedItems.indexOf(item);
      if (index >= 0) {
        this.ct_checkedItems.splice(index, 1);
      }
    }
    this.slabToCoilFilter();
    console.log(this.ct_checkedItems);
  }
  rfisChecked(item: string): boolean {
    return this.rf_checkedItems.includes(item);
  }

  rfonCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.rf_checkedItems.push(item);
    } else {
      const index = this.rf_checkedItems.indexOf(item);
      if (index >= 0) {
        this.rf_checkedItems.splice(index, 1);
      }
    }
    this.slabToCoilFilter();
    console.log(this.rf_checkedItems);
  }
  cwisChecked(item: string): boolean {
    return this.cw_checkedItems.includes(item);
  }

  cwonCheckboxChange(event: any, item: string): void {
    if (event.checked) {
      this.cw_checkedItems.push(item);
    } else {
      const index = this.cw_checkedItems.indexOf(item);
      if (index >= 0) {
        this.cw_checkedItems.splice(index, 1);
      }
    }
    this.slabToCoilFilter();
    console.log(this.cw_checkedItems);
  }
}
