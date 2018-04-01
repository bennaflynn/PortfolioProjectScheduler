import {Component} from '@angular/core';
import {MyRemoteUserService} from '../app.usersremoteservice';
import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl: './profile.html',
    providers: [MyRemoteUserService]

})

export class ProfileComponent {
    userService: MyRemoteUserService;
    employee: any;
    email: String;
    first: String;
    last: String;
    role: String;

    constructor(remoteUserService: MyRemoteUserService) {
        this.userService = remoteUserService;
        //this.assignVariables();
        this.getEmployee();
        setTimeout(()=> {this.assignVariables()},1000);
    }

    //get the employee
    async getEmployee() {
        this.userService.getEmployee()
            .subscribe(
                data => {
                    this.employee = data;
                   
                },
                error => {
                    alert(error);
                }
            )
    }

    async assignVariables() {
        //await this.getEmployee();
        console.log(this.employee);
        this.email = this.employee.email;
        this.first = this.employee.firstName;
        this.last = this.employee.lastName;
        this.role = this.employee.role;

    }

    changePassword(newPassword,confirmPassword, oldPassword) {
        if(newPassword != confirmPassword) {
            alert("Passwords must match!");
            return;
        }
        let feedbackObject = {
            "email": this.email,
            "oldPassword":oldPassword,
            "newPassword":newPassword
        }
        this.userService.changePassword(feedbackObject)
            .subscribe(
                data => {
                    if(data) {
                        alert("Password Changed");
                    } else {
                        alert("Error: Please enter correct current password");
                    }
                },
                error => {
                    alert(error);
                }
            )
    }
    
}