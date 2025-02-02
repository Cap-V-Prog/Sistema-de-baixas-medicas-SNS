import { Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {BackOfficeComponent} from "./back-office/back-office.component";
import {RegisterComponent} from "./auth/register/register.component";
import {DashboardComponent} from "./paciente/dashboard/dashboard.component";
import {LandingpageComponent} from './landingpage/landingpage.component';

export const routes: Routes = [
  {path: '', component: LandingpageComponent},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'utente', component: BackOfficeComponent},
  {path: 'users/dashboard',component: DashboardComponent},
];
