import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { AppComponent } from './app.component';
import { PageDefault }    from './defaultPage/default';
import { AddUserComponent } from './AddUser/third';
import { AllUsersComponent } from './AllUsers/loggedin';
import {LoginComponent} from './Login/app.login';
import { routing }        from './app.routing';
import { MyLinksComponent } from './mylinks';
import {BuildScheduleComponent} from './BuildSchedule/buildSchedule';
import {ScheduleComponent} from './Schedule/app.schedule';
import {ProfileComponent} from './userProfile/app.profile';



@NgModule({
  declarations: [
    AppComponent, PageDefault, AddUserComponent, AllUsersComponent, LoginComponent, MyLinksComponent, BuildScheduleComponent, ScheduleComponent, ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
