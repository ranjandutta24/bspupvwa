import { Injectable, Inject } from "@angular/core";
// import { MatSnackBar } from '@angular/material/snack-bar';
import { SESSION_STORAGE, StorageService } from "ngx-webstorage-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from "@fuse/components/navigation";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  showSnakBarMessage(
    message: string,
    type: string,
    duration: number,
    action?: string
  ) {
    this.snakBar.open(message, action, {
      duration: duration,
      panelClass: type,
    });
  }

  private apiUrl = "http://localhost:4033/api"; //Local API
  // private apiUrl = 'http://10.150.50.23:4033/api';//Dev API
  // private apiUrl = "http:localhost:4033/api"; //Dev API
  // private apiUrl = "http://192.168.10.60:3000/api"; //Dev API
  // private apiUrl = 'https://web.iroms.in/irtmaapi/api';//Prod API
  private authorization = "Bearer c2lzeFVQVkF1dGg6YjVQVTJPcFYyNCMxc24=";
  //For Sign up Link
  // private appUrl = 'http://ecollect.myaastha.in/hrmpoc/#/';
  private appUrlSms = "https%3A%2F%2Fweb.educampuz.com%2F%23%2F";
  public otype = "Company";

  private jsonUrl = "assets/jsons";
  loading = new BehaviorSubject<boolean>(true);
  currentUser = new Subject<any>();

  constructor(
    //  public snakBar: MatSnackBar,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    public http: HttpClient,
    public snakBar: MatSnackBar,
    private _fuseNavigationService: FuseNavigationService
  ) {}

  /**
   * ***********************************************************************************
   * API URL Functions
   * ***********************************************************************************
   */
  getBaseUrl(): string {
    return this.apiUrl;
  }

  getAuthorization(): string {
    return this.authorization;
  }

  // getAppUrl(): string {
  //   return this.appUrl;
  // }

  getAppUrlSms(): string {
    return this.appUrlSms;
  }

  /**
   * ***********************************************************************************
   * Local Functions
   * ***********************************************************************************
   */

  findItem(array: any, key: string, value: string): number {
    for (let index = 0; index < array.length; index++) {
      if (array[index][key] === value) {
        return index;
      }
    }
    return -1;
  }

  // showSnakBarMessage(message: string, type: string, duration: number, action?: string): void {
  //   this.snakBar.open(message, action, {
  //     duration: duration,
  //     panelClass: type
  //   });
  // }

  /**
   * ***********************************************************************************
   * Local/Session Storage Functions
   * ***********************************************************************************
   */

  setItem(key: string, value: any): void {
    this.storage.set(key, value);
  }
  // setItem(key: string, value: any): void {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }

  getItem(key: string): any {
    const value = this.storage.get(key) || undefined;
    return value;
  }
  // getItem(key: string): any {
  //   const value = localStorage.getItem(key) || undefined;
  //   return value;
  // }

  removeItem(key: string): void {
    this.storage.remove(key);
  }

  removeAll(): void {
    this.storage.clear();
  }

  getTabledataquerySelectorAll() {
    let tableData = [];

    // Extract table data from the HTML table
    const headerRow = Array.from(document.querySelectorAll("table th")).map(
      (th) => th.textContent
    );
    tableData.push(headerRow);

    const tableRows = Array.from(document.querySelectorAll("table tr")).slice(
      1
    );
    for (const row of tableRows) {
      const rowData = Array.from(row.querySelectorAll("td")).map(
        (td) => td.textContent
      );
      tableData.push(rowData);
    }

    return tableData;
  }

  getRandom(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * ***********************************************************************************
   * JSON Service Functions
   * ***********************************************************************************
   */
  getDefaultProduct() {
    //alert('1');
    return this.http
      .get(this.jsonUrl + "/defaultproducts.json")
      .pipe(map((response: Response) => response));
  }
  getCountries(): any {
    return this.http
      .get(this.jsonUrl + "/country.json")
      .pipe(map((response: Response) => response));
  }
  getDefaultRole(): any {
    // return this.http
    //   .get(this.jsonUrl + "/defaultroles.json")
    //   .pipe(map((response: Response) => response));
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: this.authorization,
      }),
    };
    return this.http
      .get(this.getBaseUrl() + "/json/defaultroles", httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  getPrivileges(): any {
    // return this.http
    //   .get(this.jsonUrl + "/privileges.json")
    //   .pipe(map((response: Response) => response));
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: this.authorization,
      }),
    };
    return this.http
      .get(this.getBaseUrl() + "/json/privileges", httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  getFeatures(): any {
    // return this.http
    //   .get(this.jsonUrl + "/features.json")
    //   .pipe(map((response: Response) => response));
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: this.authorization,
      }),
    };
    return this.http
      .get(this.getBaseUrl() + "/json/features", httpOptions)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  errorHandler(error: Response) {
    console.log(error);
    let message = error["error"]
      ? error["error"].error
        ? error["error"].error
        : error["message"]
      : error["message"];
    console.log(message);
    return throwError(
      message ||
        "Remote server unreachable. Please check your Internet connection."
    );
  }

  createDateAsUTC(d) {
    let date = new Date(d);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0 // Setting hours, minutes, and seconds to 00:00:00
    );
  }

  getStates() {
    return this.http
      .get(this.jsonUrl + "/country-state-city/state.json")
      .pipe(map((response: Response) => response));
  }

  getCities() {
    return this.http
      .get(this.jsonUrl + "/country-state-city/city.json")
      .pipe(map((response: Response) => response));
  }

  geCountries(): any {
    return this.http
      .get(this.jsonUrl + "/country.json")
      .pipe(map((response: Response) => response));
  }

  zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

  getWeekday(date: Date): string {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = new Date(date).getDay(); // Get the day of the week (0 = Sunday, 1 = Monday, ...)

    return daysOfWeek[dayIndex];
  }

  amountInWords(amount: any) {
    let numberInput = amount;
    let oneToTwenty = [
      "",
      "one ",
      "two ",
      "three ",
      "four ",
      "five ",
      "six ",
      "seven ",
      "eight ",
      "nine ",
      "ten ",
      "eleven ",
      "twelve ",
      "thirteen ",
      "fourteen ",
      "fifteen ",
      "sixteen ",
      "seventeen ",
      "eighteen ",
      "nineteen ",
    ];
    let tenth = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    // if(numberInput.toString().length > 9) return myDiv.innerHTML = 'overlimit' ;
    console.log(numberInput);
    //let num = ('0000000000'+ numberInput).slice(-9).match(/^(\d{1})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    let num: any;
    num = ("000000000" + numberInput)
      .slice(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    console.log(num);
    if (!num) return;

    let outputText =
      num[1] != 0
        ? (oneToTwenty[Number(num[1])] ||
            `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}`) + " million "
        : "";

    outputText +=
      num[2] != 0
        ? (oneToTwenty[Number(num[2])] ||
            `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}`) + "hundred "
        : "";
    outputText +=
      num[3] != 0
        ? (oneToTwenty[Number(num[3])] ||
            `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`) + " thousand "
        : "";
    outputText +=
      num[4] != 0
        ? (oneToTwenty[Number(num[4])] ||
            `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) + "hundred "
        : "";
    outputText +=
      num[5] != 0
        ? oneToTwenty[Number(num[5])] ||
          `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `
        : "";

    return outputText;
  }

  sortArrayByProperty(data, property: string) {
    return data.sort((a, b) => {
      if (a[property] < b[property]) {
        return -1;
      }
      if (a[property] > b[property]) {
        return 1;
      }
      return 0;
    });
  }
  sortArrayByPropertyReverse(data, property: string) {
    return data.sort((a, b) => {
      if (a[property] < b[property]) {
        return 1; // Reverse the order of comparison
      }
      if (a[property] > b[property]) {
        return -1; // Reverse the order of comparison
      }
      return 0;
    });
  }

  convertToTitleCase(input: string): string {
    return input
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  closeManNavigation(): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        "mainNavigation"
      );

    if (navigation) {
      // Toggle the opened status
      navigation.close();
    }
  }
  openManNavigation(): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        "mainNavigation"
      );

    if (navigation) {
      // Toggle the opened status
      navigation.open();
    }
  }
  /**
   * ***********************************************************************************
   * Clear all store items
   * ***********************************************************************************
   */

  clearStore(): any {
    /* this.store.dispatch(new ClearAllUser(undefined));
    this.store.dispatch(new ClearAllRole(undefined)); */
  }
}
