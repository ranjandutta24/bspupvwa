import { Component } from "@angular/core";
import { UntypedFormBuilder, Validators } from "@angular/forms";
import { CommonService } from "app/services/common.service";
import { ReportService } from "app/services/report.service";

@Component({
  selector: "app-tracking-page",
  standalone: true,
  imports: [],
  templateUrl: "./tracking-page.component.html",
  styleUrl: "./tracking-page.component.scss",
})
export class TrackingPageComponent {
  flag: boolean = false;
  flag1: boolean = false;
  intervalId: any;
  intervalId1: any;
  intervalld: any;
  trackingData: any;
  fur1: boolean;
  fur2: boolean;
  fur3: boolean;
  fur4: boolean;

  constructor(
    private reportService: ReportService,
    private _formBuilder: UntypedFormBuilder,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.intervalld = setInterval(() => {
      this.callTrackingapi();
    }, 3000); // 2000 milliseconds = 2 seconds
    setInterval(this.callTrackingapi, 3000);
    // this.callTrackingapi();
  }

  callTrackingapi() {
    this.reportService.tracking({}).subscribe(
      (response) => {
        let data = JSON.parse(JSON.stringify(response));
        this.trackingData = data[0];
        this.trackingData.FUR1STATUS == "0"
          ? (this.fur1 = false)
          : (this.fur1 = true);
        this.trackingData.FUR2STATUS == "0"
          ? (this.fur2 = false)
          : (this.fur2 = true);
        this.trackingData.FUR3STATUS == "0"
          ? (this.fur3 = false)
          : (this.fur3 = true);
        this.trackingData.FUR4STATUS == "0"
          ? (this.fur4 = false)
          : (this.fur4 = true);
      },
      (respError) => {
        // this.loading = false;
        this.commonService.showSnakBarMessage(respError, "error", 2000);
      }
    );
  }
}
