import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';
import { AppComponent }          from './app.component';
import { AddUserComponent }        from './AddUser/third';
import { AllUsersComponent }        from './AllUsers/loggedin';
import { PageDefault }           from './defaultPage/default';
import {LoginComponent}     from './Login/app.login';
import {BuildScheduleComponent} from './BuildSchedule/buildSchedule';
import {ScheduleComponent} from './Schedule/app.schedule';

const appRoutes: Routes = [
  { path: 'page-a', component: AddUserComponent },
  { path: 'page-b', component: AllUsersComponent },
  { path: 'page-c', component: BuildScheduleComponent},
  {path: 'login', component: LoginComponent},
  {path: 'schedule', component: ScheduleComponent},
  { path: '', redirectTo: '/page-a', pathMatch: 'full' },
  { path: '**', component: PageDefault }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
