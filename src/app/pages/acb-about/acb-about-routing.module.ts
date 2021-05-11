import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcbAboutPage } from './acb-about.page';

const routes: Routes = [
  {
    path: '',
    component: AcbAboutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcbAboutPageRoutingModule {}
