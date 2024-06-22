import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  baseUrl = '';
  authorization = '';
  report = new BehaviorSubject<any>([]);
  constructor(public http: HttpClient, public commonService: CommonService) {
    this.baseUrl = this.commonService.getBaseUrl();
    this.authorization = this.commonService.getAuthorization();
  }

  shiftHourlyReport(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/report/shiftHourlyReport', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  rolseqReport(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/report/rolseqReport', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  customerProdReport(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/report/customerProdReport', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  qualityReport(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/report/qualityReport', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  technicalProductionReport(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/report/technicalProductionReport', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  millTempTrendReport(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/report/millTempTrendReport', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  errorHandler(error: Response) {
    console.log(error);
    let message = (error['error']) ? ((error['error'].error) ? error['error'].error : error['message']) : error['message'];
    console.log(message);
    return throwError(message || 'Remote server unreachable. Please check your Internet connection.');
  }
}

