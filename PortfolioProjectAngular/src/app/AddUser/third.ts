import {MyRemoteLoginService} from "../app.myremoteloginservice";
import {Router} from '@angular/router';
 import { Component } from '@angular/core';
 @Component({
     templateUrl: 'third.html'
 })
 export class AddUserComponent {
     //this is going to be the register page 
     remoteRegister: MyRemoteLoginService;
     userName: string;
     password:string;
     confirmPassword:string;
     firstName: string;
     lastName: string;

     constructor(private _remoteRegister: MyRemoteLoginService, private router: Router) {
         let x = "t";
         this.remoteRegister = _remoteRegister;
     }

     register(userName, password, confirmPassword, firstName, lastName){
        let FeedBackObject = {
            'username':userName,
            'password':password,
            'confirmpassword':confirmPassword,
            'firstname':firstName,
            'lastname':lastName
        }
        this.remoteRegister.postRegister(FeedBackObject)
            .subscribe(
                data => {
                    //sessionStorage.setItem('auth_token', data['token']);
                    console.log("User registered");
                    console.log(data);
                },
                error => {
                    alert(error);
                }
            )
            this.router.navigate(['allUsers']);
     }
 
 }
 
 