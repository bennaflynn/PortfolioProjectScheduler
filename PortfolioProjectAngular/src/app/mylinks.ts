import { Component } from '@angular/core';
import {Router} from '@angular/router';
@Component({
    selector: '<my-links>',
    template: `<hr>
    
    <div *ngIf="loggedIn">
            <a routerLink="/schedule"
            routerLinkActive="Active">
            Schedule |</a>
            <a *ngIf="isManager" routerLink="/allUsers" routerLinkActive="active">All Users |</a>
            <a *ngIf="isManager" routerLink="/addUser" routerLinkActive="active">Add New User |</a>
            <a *ngIf="isManager" routerLink="/buildSchedule" routerLinkActive="active">Build Schedule |</a>
            <a routerLink="/profile" routerLinkActive="active">Profile | </a>
        
    <input type='submit' class="btn btn-danger" (click)='logout()' value='logout'><br/>
    </div>
    <hr>`
})
export class MyLinksComponent { 
    loggedIn = false;
    isManager = false;

    constructor(private router: Router) {
        
            if(sessionStorage.getItem('auth_token')) {
                this.loggedIn = true;
                if(sessionStorage.getItem('user_role') == "Manager") {
                    this.isManager = true;
                } else {
                    this.isManager = false;
                }
            }
            else {
                this.loggedIn = false;
                this.router.navigate(['login']);
            }
        
     
    }
    logout() {
      
        
        if(sessionStorage.getItem('auth_token'))
         {
            sessionStorage.setItem('auth_token',null);
            sessionStorage.setItem('user_role',null);
            this.loggedIn = false;
            this.router.navigate(['login']);
         }
    }

}
