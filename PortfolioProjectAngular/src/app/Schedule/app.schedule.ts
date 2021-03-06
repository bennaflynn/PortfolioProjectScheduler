import {Component} from '@angular/core';
import {MyRemoteUserService} from '../app.usersremoteservice';

class Day {
    name: String;
    startTime: String;
    day: String;
    week: String;
}

@Component({
    templateUrl: './schedule.html',
    providers: [MyRemoteUserService]
})

export class ScheduleComponent {
    remoteUserService: MyRemoteUserService
    schedule: any;

    monday:Array<Day>;
    tuesday:Array<Day>;
    wednesday:Array<Day>;
    thursday:Array<Day>;
    friday:Array<Day>;
    saturday:Array<Day>;
    sunday:Array<Day>;

    isManager = false;
    
    sweek1: Array<Array<Day>>;
    sweek2: Array<Array<Day>>;
   

    constructor(remoteUserService: MyRemoteUserService) {
        this.remoteUserService = remoteUserService;
        
        this.monday = [];
        this.tuesday = [];
        this.wednesday = [];
        this.thursday = [];
        this.friday = [];
        this.saturday = [];
        this.sunday = [];
        
        if(sessionStorage.getItem("user_role") == "Manager") {
            this.isManager = true;
        }
        
        this.sweek1 = [[]];
        this.sweek2 = [[]];
        
        //this.getSchedule();
        this.getScheduleByWeek(1);
        
        this.getScheduleByWeek(2);
        
        
        
    }

    isNotEmpty(day:Array<Day>) {
        if(day.length > 0) {
            return true;
        }
        return false;
    }

    getScheduleByWeek(week) {
        this.remoteUserService.getScheduleByWeek(week) 
            .subscribe(
                data => {
                    if(week == 1) {
                        this.buildWeeks(data,this.sweek1);
                    } else {
                        this.buildWeeks(data,this.sweek2);
                    }
                    
                },
                error => {
                    alert(error);
                }
            )
    }

    getSchedule() {
        this.remoteUserService.getSchedule()
            .subscribe(
                data => {
                    this.schedule = data;
                    console.log(this.schedule);
                },
                error => {
                    alert(error);
                }
            )
    }

    deleteShift(shiftId) {
        console.log(shiftId);
        // let jsonShift = JSON.stringify(shiftId);
        this.remoteUserService.deleteShift(shiftId)
            .subscribe(
                data => {
                    
                },
                error => {
                   
                }
            )
    }
    deleteShiftDay(week, day) {
        let feedbackObject = {
            "week": week,
            
            "day": day
        }
        this.remoteUserService.deleteScheduleDay(feedbackObject)
            .subscribe(
                data => {
                    alert("Shifts for day deleted")
                },
                error => {

                }
            )
    }
    confirmDelete() {
        if(confirm("Are you sure you want to delete all shifts?")) {
            this.deleteAllShifts();
            alert("Shifts deleted");
        }
    }
    deleteAllShifts() {
        this.remoteUserService.deleteAllShifts() 
            .subscribe(
                data => {
                    alert("Data deleted");
                }, error => {

                }
            )
    }

    


    buildWeeks(data, schedule) {

        this.monday = [];
        this.tuesday = [];
        this.wednesday = [];
        this.thursday = [];
        this.friday = [];
        this.saturday = [];
        this.sunday = [];

        data.forEach(element => {
            switch(element.day) {
                case "Monday":
                    this.monday.push(element);
                    break;
                case "Tuesday":
                    this.tuesday.push(element);
                    break;
                case "Wednesday":
                    this.wednesday.push(element);
                    break;
                case "Thursday":
                    this.thursday.push(element);
                    break;
                case "Friday":
                    this.friday.push(element);
                    break;
                case "Saturday":
                    this.saturday.push(element);
                    break;
                case "Sunday":
                    this.sunday.push(element);
                    break;
            }
        });

        schedule.push(this.monday);
        schedule.push(this.tuesday);
        schedule.push(this.wednesday);
        schedule.push(this.thursday);
        schedule.push(this.friday);
        schedule.push(this.saturday);
        schedule.push(this.sunday);

        console.log(schedule);
    }

}