import { Component } from '@angular/core';
import {MyRemoteUserService} from '../app.usersremoteservice';
@Component({
    templateUrl: 'loggedIn.html'
})
export class AllUsersComponent { 
    userService: MyRemoteUserService;
    users: any;

    constructor(private _userService: MyRemoteUserService){
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
