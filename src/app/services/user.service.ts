import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = '';
  authorization = '';
  userlists = new BehaviorSubject<any>([]);
  hauthoritylist = new BehaviorSubject<any>([]);
  currentUser = new Subject<any>();
  editData = new Subject<any>();
  constructor(public http: HttpClient, public commonService: CommonService) {
    this.baseUrl = this.commonService.getBaseUrl();
    this.authorization = this.commonService.getAuthorization();
  }
  addItem(data) {
    this.userlists.value.push(data);
    this.userlists.next(this.userlists.value);
  }

  updateItem(data) {
    let index = this.userlists.value.map(item => item._id).indexOf(data._id);
    if (index >= 0) this.userlists.value[index] = data;
    this.userlists.next(this.userlists.value);
  }

  removeItem(data) {

    this.userlists.next(this.userlists.value.filter(item => item._id !== data._id));
  }
  create(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/create', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  update(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/update', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  delete(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/delete', user, httpOptions)
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
    return this.http.get(this.baseUrl + '/user/show/' + id, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  checkHigherAuthority(userid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.get(this.baseUrl + '/user/checkHigherAuthority/' + userid, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  showUserOfOrganization(ocode: string, userid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.get(this.baseUrl + '/user/showUser/' + ocode + '/' + userid, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  showUser(userid: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.get(this.baseUrl + '/user/showUser/' + userid, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  clearCachedData() {
    const headers = { 'Cache-Control': 'no-cache, no-store, must-revalidate' };
    return this.http.get(this.baseUrl, { headers })
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  search(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/search', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  count(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/count', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  updatePassword(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/updatePassword', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  resetPassword(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/resetPassword', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  upload(file: FormData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/upload', file, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  profilePic(filePath: string) {
    if (!filePath) {
      filePath = 'nouser.png';
    }
    return this.baseUrl + '/user/profilePic/' + filePath;
  }

  signin(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/signin', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }

  signout(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      })
    };
    return this.http.post(this.baseUrl + '/user/signout', user, httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandler)
      )
  }



  verifyToken(user: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization,
        'user-token': user.usertoken
      })
    };
    return this.http.get(this.baseUrl + '/user/verifyToken', httpOptions)
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
