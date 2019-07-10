import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path:'', pathMatch:'full',
    component: DashboardComponent
  },
  {
    path:'settings', pathMatch:'full',
    component:SettingsComponent
  },
  {
    path:'profile', pathMatch:'full',
    component:ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
