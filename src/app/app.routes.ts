import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { CounterComponent } from './Components/counter/counter.component';
import { ReportComponent } from './Components/report/report.component';

export const routes: Routes = [
    { path: '', title:"Welcome",component: HomeComponent },
    { path: 'counter', component: CounterComponent },
  { path: 'report', component: ReportComponent }
];
