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

        this.getSchedule();
        setTimeout(()=> {
            this.buildDays();
            console.log(this.allDays)
        },1000);
        
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
}