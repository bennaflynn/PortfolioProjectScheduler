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


    allDays: Array<Array<Day>>;
    newDays: Array<Array<Day>>;

    week1:Array<Array<Day>>;
    week2:Array<Array<Day>>;

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
        this.newDays = [[]];

        this.week1 = [];
        this.week2 = [];

        this.getSchedule();
        setTimeout(()=> {
            this.buildDays();
            

            setTimeout(() => {
                //this.separateDays();
                console.log(this.week2);
                console.log(this.week1);
                console.log(this.allDays);
            },1000);
        },2000);
        
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