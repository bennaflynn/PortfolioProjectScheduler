import { Component } from '@angular/core';
import {MyRemoteLoginService} from '../app.myremoteloginservice';
import {Router} from '@angular/router';

@Component({
    templateUrl: './login.html',
    providers: [MyRemoteLoginService]
  })
  export class LoginComponent {
    remoteLogin: MyRemoteLoginService;
    userName: string;
    password: string;
    token: string;
    privateData: any;
    message: string;
  
    constructor(remoteLogin: MyRemoteLoginService, private router: Router) {
      this.remoteLogin = remoteLogin;
      
    }

    getUserRole(email) {
      let FeedBackObject = {
        "email":email
      }
      this.remoteLogin.postGetRole(FeedBackObject).subscribe(
        data => {
          console.log("Users role: ");
          console.log(data);
          sessionStorage.setItem('user_role',data['roleName']);
        },
        error => {
          alert(error);
        }
      )
    }
  
    getPrivateData() {
      this.remoteLogin.getPrivateInfo().subscribe(
        //success
        data => {this.privateData = data;
        console.log(data);
        },
        error => {
          alert(error);
        }
      )
    }
  
    login(userName,password) {
      //create the javascript object in the 
      //format required by the backend asp.net
      let FeedBackObject = {
        "userName":userName,
        "password":password
      }
      this.remoteLogin.postLogin(FeedBackObject).subscribe(
        //success
        data => {
          //store token with session data
          this.getUserRole(userName);
          sessionStorage.setItem('auth_token', data['token']);
          //this.token = data['token'];
          //this.message = "The user is logged in";
          this.privateData = null;
          console.log(data);
          
          setTimeout(()=> {          
            this.router.navigate(['schedule']);
          },500);
          
        },
        error => {
          alert(error);
        }
      )
    }
    logout() {
      //the way to log out is simply to set the token on the client to null
      sessionStorage.setItem('auth_token',null);
      sessionStorage.setItem('user_role',null);
      this.token = null;
      this.message = "You are logged out";
    }
  }