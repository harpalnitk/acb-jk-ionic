import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlowersPage } from './flowers.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: FlowersPage
  // },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('./details/details.module').then((m) => m.DetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlowersPageRoutingModule {}
