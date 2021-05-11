import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarRentalPage } from './car-rental.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: CarRentalPage
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
  // {
  //   path: 'detail',
  //   loadChildren: () =>
  //     import('./detail/detail.module').then((m) => m.DetailPageModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarRentalPageRoutingModule {}
