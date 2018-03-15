import { Component } from '@angular/core';
import {MyRemoteUserService} from '../app.usersremoteservice';
import {Router} from '@angular/router';
@Component({
    templateUrl: 'loggedIn.html'
})
export class AllUsersComponent { 
    userService: MyRemoteUserService;
    users: any;

    constructor(private router: Router, private _userService: MyRemoteUserService){
         //get them out of here if they are not a manager
        if(sessionStorage.getItem('user_role') != "Manager") {
            this.router.navigate(['schedule']);
        }
        this.userService = _userService;
        this.getAllUsers();
    }

    getAllUsers() {
        this.userService.getAllUsers().subscribe(
            data => {this.users = data;
            console.log(data);
            },
            error => {
                alert(error);
            }
        )
    }

}
