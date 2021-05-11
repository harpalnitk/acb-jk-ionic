import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: HomePage,
    children:[
      {
        path: 'acb',
        loadChildren: () => import('./acb/acb.module').then( m => m.AcbPageModule)
      },
      {
        path: 'complaints',
        loadChildren: () => import('./complaints/complaints.module').then( m => m.ComplaintsPageModule),
        canLoad: [AuthGuard]
      },
      {
        path:'',
        redirectTo:'/home/tabs/acb',
        pathMatch: 'full'
      
      }
    ]
  },
  {
    path:'',
    redirectTo:'/home/tabs/acb',
    pathMatch: 'full'
  
  }

];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
