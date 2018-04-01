import {Injectable} from '@angular/core';
import {Component} from '@angular/core';
import {URLSearchParams,QueryEncoder} from '@angular/http';
import {Http,Response,Headers,RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class MyRemoteUserService {
    public site: string;
    constructor(private http: Http) {
        this.site = "http://localhost:50005/tokenapi/"
    }

    getAllUsers(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });

            let dataUrl = this.site + 'GetAllUsers';
            return this.http.get(dataUrl,options)
                .map(this.extractData)
                .catch(this.handleError);
    }

    getAllEmployees(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let dataUrl = this.site + "GetAllEmployees";
        return this.http.get(dataUrl,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //POST - SCHEDULE
    postSchedule(feedback:Object): Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        //let options = new RequestOptions({headers:headers});
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let url = this.site+"postschedule";

        return this.http.post(url,feedback,options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    //POST - Get Schedule by week
    getScheduleByWeek(feedback:Object): Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        //let options = new RequestOptions({headers:headers});
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let url = this.site+"getShiftsForWeek";
       
        return this.http.post(url,feedback,options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    //POST - Delete
    deleteShift(feedback:String): Observable<Comment[]> {
        let shift = JSON.stringify({"ShiftId" : feedback})
        let headers = new Headers({'Content-Type':'application/json'});
        //let options = new RequestOptions({headers:headers});
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        // let shiftVM = {
        //     "shiftId": feedback
        // }
        let url = this.site+"deleteShift";
        return this.http.post(url,shift,options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    //POST - Delete Schedule by day
    deleteScheduleDay(feedback: Object): Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        //let options = new RequestOptions({headers:headers});
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let url = this.site+"deleteShiftDay";
        let shiftDay = {
            "Week":feedback['week'],
            "Day":feedback['day']
        }
        return this.http.post(url, shiftDay, options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    //DELETE - Delete all shifts
    deleteAllShifts():Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        //let options = new RequestOptions({headers:headers});
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let url = this.site+"deleteallshifts";
        return this.http.delete(url,options)
            .map(this.extractData)
            .catch(this.handleError)
    }

    //GET - SCHEDULE
    getSchedule(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let dataUrl = this.site + "GetAllShifts";
        return this.http.get(dataUrl,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //GET - Email the schedule out to employees
    emailEmployees():Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let dataUrl = this.site + "sendschedulebyemail";
        return this.http.get(dataUrl,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //Delete the user
    deleteUser(feedback:Object):Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let employeeVM = {
            "Email":feedback["email"]
        }
        let dataUrl = this.site + "deleteUser";
        return this.http.post(dataUrl,employeeVM,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //POST - Get the current user
    getEmployee():Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let dataUrl = this.site + "GetEmployee";
        return this.http.get(dataUrl, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //Make the user a manager
    makeManager(feedback:Object):Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let employeeVM = {
            "Email":feedback["email"]
        }
        let dataUrl = this.site + "makeUserManager";
        return this.http.post(dataUrl,employeeVM,options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    //Change password
    changePassword(feedback:Object):Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let changePassVM = {
            "Email":feedback["email"],
            "OldPassword":feedback["oldPassword"],
            "NewPassword":feedback["newPassword"]
        }
        let dataUrl = this.site + "changepassword";
        return this.http.post(dataUrl,changePassVM,options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    

     //retrieval of JSON from .net succeeds!
    private extractData(res:Response) {
        let body = res.json();
        return body;
    }

     //an error has occured
    private handleError(error:any) {
        let errMesg = (error.message) ? error.messsage : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(errMesg);
    }
}