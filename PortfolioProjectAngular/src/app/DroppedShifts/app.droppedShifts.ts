import {Component} from '@angular/core';
import {MyRemoteUserService} from '../app.usersremoteservice';

@Component({
    templateUrl: './droppedShifts.html'
})

export class DroppedShiftsComponent {
    shifts:any;
    remoteService:MyRemoteUserService;

    constructor(remoteService:MyRemoteUserService) {
        this.remoteService = remoteService;
        this.getDroppedShifts();
    }

    pickUpShift(shiftId) {
        let feedbackObject = {
            "shiftId":shiftId
        }
        this.remoteService.pickUpShift(feedbackObject)
            .subscribe(
                data => {
                    if(data) {
                        alert("Shift was picked up!");
                    } else {
                        alert("Shift was not picked up. You sure you are allowed to do that?");
                    }
                },
                error => {
                    alert(error);
                }
            )
    }

    getDroppedShifts() {
        this.remoteService.getDroppedShifts()
            .subscribe(
                data => {
                    this.shifts = data;
                },
                error => {
                    alert(error);
                }
            )
    }
}