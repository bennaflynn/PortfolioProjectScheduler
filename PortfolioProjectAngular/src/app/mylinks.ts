import { Component } from '@angular/core';
import {Router} from '@angular/router';
@Component({
    selector: '<my-links>',
    template: `<hr>
    
    <div *ngIf="loggedIn" class="text-right">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        
       
        <div  id="navbarTogglerDemo02">
                <button class="btn btn-secondary" >
                    <a class="nav-link" routerLink="/schedule"
                    routerLinkActive="Active">
                    Schedule </a>
                </button>
                <button class="btn btn-secondary">
                    <a class="nav-link" routerLink="/droppedShifts" routerLinkActive="active">Dropped Shifts</a>
                </button>
                <button class="btn btn-secondary" *ngIf="isManager">
                    <a class="nav-link text-light"  routerLink="/allUsers" routerLinkActive="active">All Users </a>
                </button>
                <button class="btn btn-secondary" *ngIf="isManager">
                    <a class="nav-link"  routerLink="/addUser" routerLinkActive="active">Add New User </a>
                </button>
                <button class="btn btn-secondary" *ngIf="isManager">
                    <a class="nav-link"  routerLink="/buildSchedule" routerLinkActive="active">Build Schedule </a>
                </button>
                <button class="btn btn-secondary">
                    <a class="nav-link" routerLink="/profile" routerLinkActive="active">Profile</a>
                </button>
                    <input class="nav-link" type='submit' class="btn btn-danger" (click)='logout()' value='logout'><br/>
              
        </div>
            
           
            
            
            
        
    
    </nav>
    </div>
    <hr>

  
    `
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
