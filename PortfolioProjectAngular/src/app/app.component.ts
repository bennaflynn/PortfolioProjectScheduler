import { Component } from '@angular/core';
import {MyRemoteLoginService} from './app.myremoteloginservice';
import {Router} from '@angular/router';
import {MyRemoteUserService} from './app.usersremoteservice';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MyRemoteLoginService, MyRemoteUserService]
})

export class AppComponent{
  token: string;
  show: boolean = false;
  
  constructor(private router: Router) {
    this.token = sessionStorage.getItem('auth_token');
    if(this.token != 'null') {
      this.show = true;
      //navigate to the main page if the user has a token
      
    } else {
      //navigate back to the login page if they have not logged in
      this.router.navigate(['login']);
    }
    
  }


 }
// export class AppComponent {
//   remoteLogin: MyRemoteLoginService;
//   userName: string;
//   password: string;
//   token: string;
//   privateData: any;
//   message: string;

//   constructor(remoteLogin: MyRemoteLoginService) {
//     this.remoteLogin = remoteLogin;
//   }

//   getPrivateData() {
//     this.remoteLogin.getPrivateInfo().subscribe(
//       //success
//       data => {this.privateData = data;
//       console.log(data);
//       },
//       error => {
//         alert(error);
//       }
//     )
//   }

//   login(userName,password) {
//     //create the javascript object in the 
//     //format required by the backend asp.net
//     let FeedBackObject = {
//       "userName":userName,
//       "password":password
//     }
//     this.remoteLogin.postLogin(FeedBackObject).subscribe(
//       //success
//       data => {
//         //store token with session data
//         sessionStorage.setItem('auth_token', data['token']);
//         this.token = data['token'];
//         this.message = "The user is logged in";
//         this.privateData = null;
//         console.log(data);
//       },
//       error => {
//         alert(error);
//       }
//     )
//   }
//   logout() {
//     //the way to log out is simply to set the token on the client to null
//     sessionStorage.setItem('auth_token',null);
//     this.token = null;
//     this.message = "You are logged out";
//   }
// }
