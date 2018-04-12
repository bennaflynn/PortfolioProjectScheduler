import {Injectable} from '@angular/core';
import {Component} from '@angular/core';
import {URLSearchParams,QueryEncoder} from '@angular/http';
import {Http,Response,Headers,RequestOptions} from '@angular/http'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

export class LoginModel {
    Username: string;
    Password: string;
}

//this class handles all our login, logout processing
@Injectable()
export class MyRemoteLoginService {
    loginModel : LoginModel;
    public site: string;
    constructor(private http: Http) {
        this.site = "/tokenapi/"
    }
    //GET _ Private data, need to be logged in
    //token needed
    getPrivateInfo(): Observable<Comment[]> {
        let headers = new Headers({ 'Content-Type': 'application/json' }); 

        // Need to include 'Authorization' property with token in header.
        // Read token value from the JavaScript session.
        headers.append( 'Authorization', 'Bearer ' 
                     + sessionStorage.getItem('auth_token'))
        let options = new RequestOptions({
            headers: headers
        });
        console.log(headers);

        let dataUrl = this.site + 'GetPrivateData';
        return this.http.get(dataUrl,options)
            .map(this.extractData)
            .catch(this.handleError);

    }
    //POST - Login
    postLogin(feedback: Object): Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let url = this.site+"login";
        let LoginModel = {
            "Email":feedback['userName'],
            "Password":feedback['password']
        }
        return this.http.post(url, LoginModel,options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    //POST - check the users roles
    postGetRole(feedback:Object):Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new RequestOptions({headers:headers});
        let url = this.site+"getRole";
        let RoleModel = {
            "Email":feedback['email']
        }
        return this.http.post(url, RoleModel,options) 
                .map(this.extractData)
                .catch(this.handleError);
    }
    //POST - Register
    postRegister(feedback:Object): Observable<Comment[]> {
        let headers = new Headers({'Content-Type':'application/json'});
        //let options = new RequestOptions({headers:headers});
        headers.append( 'Authorization', 'Bearer ' 
        + sessionStorage.getItem('auth_token'))
            let options = new RequestOptions({
                headers: headers
            });
        let url = this.site+"register";
        let RegisterModel = {
            "Email":feedback['username'],
            "Password":feedback['password'],
            "ConfirmPassword":feedback['confirmpassword'],
            "FirstName":feedback['firstname'],
            "LastName":feedback['lastname']
        }
        return this.http.post(url, RegisterModel,options)
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
