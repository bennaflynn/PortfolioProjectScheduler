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


    //allDays: Array<Array<Day>>;
    
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
  
        this.allDays = [[]];
        
        this.sweek1 = [[]];
        this.sweek2 = [[]];
        
        //this.getSchedule();
        this.getScheduleByWeek(1);
        
        this.getScheduleByWeek(2);
        setTimeout(()=> {
            
            

            setTimeout(() => {
                console.log(this.sweek1);
                console.log(this.sweek2);
                
            },1000);
        },2000);
        
        
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

    buildDays() {
        this.schedule.forEach(element => {
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

        this.allDays.push(this.monday);
        this.allDays.push(this.tuesday);
        this.allDays.push(this.wednesday);
        this.allDays.push(this.thursday);
        this.allDays.push(this.friday);
        this.allDays.push(this.saturday);
        this.allDays.push(this.sunday);
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
    }

    // separateDays() {
    //     this.allDays.forEach(element => {
    //         for(let i = 0; i < element.length; i++) {
    //             if(element[i].week == "1") {
    //                 this.week1.push(element[i]);
    //             } else {
    //                 this.week2.push(element[i]);
    //             }
    //         }
    //     });
    //     this.newDays.push(this.week1);

    // }
    
}