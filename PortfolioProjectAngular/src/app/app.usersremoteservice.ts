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