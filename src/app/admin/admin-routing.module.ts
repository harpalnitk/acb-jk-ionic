import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPage } from './admin.page';

const routes: Routes = [
  {
  path: 'tabs',
  component: AdminPage,
  children: [
    {
      path: 'users',
      loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
    },
    {
      path: 'complaints',
      loadChildren: () => import('./complaints/complaints.module').then( m => m.ComplaintsPageModule)
    },
    {
      path:'',
      redirectTo:'/admin/tabs/complaints',
      pathMatch: 'full'
    
    }
  ]
  },
  {
    path:'',
    redirectTo:'/admin/tabs/complaints',
    pathMatch: 'full'
  
  },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
