import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { AppComponent }          from './app.component';
import { AddUserComponent }        from './AddUser/third';
import { AllUsersComponent }        from './AllUsers/loggedin';
import { PageDefault }           from './defaultPage/default';
import {LoginComponent}     from './Login/app.login';
import {BuildScheduleComponent} from './BuildSchedule/buildSchedule';
import {ScheduleComponent} from './Schedule/app.schedule';
import {ProfileComponent} from './userProfile/app.profile';



const appRoutes: Routes = [
  { path: 'addUser', component: AddUserComponent },
  { path: 'allUsers', component: AllUsersComponent },
  { path: 'buildSchedule', component: BuildScheduleComponent},
  { path: 'profile', component: ProfileComponent},
  {path: 'login', component: LoginComponent},
  {path: 'schedule', component: ScheduleComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageDefault }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
