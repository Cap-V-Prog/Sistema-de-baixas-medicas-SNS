import { Routes } from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {BackOfficeComponent} from "./back-office/back-office.component";
import {RegisterComponent} from "./auth/register/register.component";
import {DashboardComponent} from "./paciente/dashboard/dashboard.component";

export const routes: Routes = [
  {path: '', component: BackOfficeComponent},
  {path:'Login', component: LoginComponent},
  {path:'Register', component: RegisterComponent},
  {path: 'users/dashboard',component: DashboardComponent},
];
