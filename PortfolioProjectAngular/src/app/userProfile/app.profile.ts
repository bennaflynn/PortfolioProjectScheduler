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

    employeeSchedule: any;

    oldpassword:String;
    newPassword:String;
    confirmPassword:String;

    constructor(remoteUserService: MyRemoteUserService) {
        this.userService = remoteUserService;
        //this.assignVariables();
        this.getShiftsForEmployee();
        this.getEmployee();
        setTimeout(()=> {this.getEmployee(); setTimeout(()=> {this.assignVariables()},1000)},1000);
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

    async getShiftsForEmployee() {
        this.userService.getScheduleByEmployee()
            .subscribe(
                data => {
                    console.log(data);
                    this.employeeSchedule = data;
                },
                error => {
                    alert(error);
                }
            )
    }

    dropShift(shiftId) {
        let feedbackObject = {
            "shiftId": shiftId
        }
        this.userService.dropShift(feedbackObject)
            .subscribe(
                data => {
                    if(data) {
                        alert("Shift has been dropped");
                    } else {
                        alert("Something went wrong on the server. The code monkeys are fixing it.")
                    }
                },
                error => {
                    alert(error);
                }
            )
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