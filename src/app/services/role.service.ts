import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  baseUrl = '';
  authorization = '';
  rolelist = new BehaviorSubject<any>([]);
  editData = new Subject<any>();
  currentUser: any;

  constructor(public http: HttpClient, public commonService: CommonService,) {
    this.baseUrl = this.commonService.getBaseUrl();
    this.authorization = this.commonService.getAuthorization();
    //this.currentUser = this.commonService.getItem('currentUser');

  }



  addItem(data) {
    this.rolelist.value.push(data);
    this.rolelist.next(this.rolelist.value);
  }

  updateItem(data) {
    let index = this.rolelist.value.map(item => item._id).indexOf(data._id);
    if (index >= 0) this.rolelist.value[index] = data;
    this.rolelist.next(this.rolelist.value);
  }

  removeItem(data) {

    this.rolelist.next(this.rolelist.value.filter(item => item._id !== data._id));
  }
  create(payload: any) {
    //payload['userid'] = this.currentUser.userid;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/role/create', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  update(payload: any) {
    // payload['userid'] = this.currentUser.userid;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/role/update', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  delete(payload: any) {
    // payload['userid'] = this.currentUser.userid;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/role/delete', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  count(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/role/count', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  search(payload: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/role/search', payload, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }
  show(id: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.get(this.baseUrl + '/role/show/' + id, httpOptions)
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
