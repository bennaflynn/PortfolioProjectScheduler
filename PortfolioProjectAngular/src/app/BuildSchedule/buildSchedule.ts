import {Component} from '@angular/core';
import {MyRemoteUserService} from '../app.usersremoteservice';
import {Router} from '@angular/router';

class EmployeeData {
    id: string;
    fname:string;
    lname:string;
    startTime:string;
    week: string;
    day: string;
} 

@Component({
    templateUrl: 'buildSchedule.html'
})
export class BuildScheduleComponent {
    userService: MyRemoteUserService;
    employees: any;
    week: any;
    dayOfWeek:any;
    nameArray:Array<any>;
    counter:number;
   

    empData: Array<EmployeeData>;
    //the array that will get sent to the server
    postEmpData: Array<EmployeeData>;

    temp: EmployeeData;

    test: EmployeeData;

    constructor(private router: Router,private _userservice: MyRemoteUserService) {
        //get them out of here if they are not a manager
        if(sessionStorage.getItem('user_role') != "Manager") {
            this.router.navigate(['schedule']);
        }
        this.userService = _userservice;
        this.getAllEmployees();
        //the two weeks that the manager can book the schedule
        this.buildWeek();

        this.dayOfWeek = [
            {'day':'Monday'},
            {'day':'Tuesday'},
            {'day':'Wednesday'},
            {'day':'Thursday'},
            {'day':'Friday'},
            {'day':'Saturday'},
            {'day':'Sunday'},
        ]
        
        
        this.postEmpData = [];
        this.empData = [];

        //build the object of employees
        //the timeout is on cause it takes a minute to get the response from the server
        
        setTimeout(()=> {
            for(let i = 0; i < this.employees.length; i++) {
                var temp : EmployeeData = {
                    id : this.employees[i].id,
                    fname : this.employees[i].firstname,
                    lname : this.employees[i].lastname,
                    startTime : null,
                    week : null,
                    day : null
                }
                
                    
                this.empData.push(temp);
            }
           
        },1000)
        console.log("Employees");
        console.log(this.empData);
        
        
    }
    buildWeek() {
        this.week =  [{'week':1,'display':'Week 1'},{'week':2, 'display':'Week 2'}];;
    }
    getAllEmployees() {
        this.userService.getAllEmployees()
            .subscribe(
                data => {
                    console.log(data);
                    this.employees = data;
                    
                },
                error => {
                    alert(error);
                }
            )
    }
    submitArray(day:any,week:any) {
        this.postEmpData = [];

        for(let i = 0; i < this.empData.length; i++) {
            if(this.empData[i].startTime != null) {
                var emp: EmployeeData = {
                    id : this.empData[i].id,
                    fname : this.empData[i].fname,
                    lname : this.empData[i].lname,
                    startTime : this.empData[i].startTime,
                    week: week,
                    day: day
                }
                
                this.postEmpData.push(emp);
                //reset the data
                this.empData[i].startTime = null;
            }
            
        }
        var obj = JSON.stringify(this.postEmpData); 
        console.log(obj);
        this.postSchedule(obj); 
    }

    emailSchedule() {
        this.userService.emailEmployees()
            .subscribe( 
                data => {

                },
                error => {
                    
                }
            )
    }
    postSchedule(empDataArray) {
        this.userService.postSchedule(empDataArray)
            .subscribe( 
                data => {
                    console.log("Posted successfully");
                },
                error => {
                    console.log("Something has gone horribly wrong")
                }
            )
    }
}