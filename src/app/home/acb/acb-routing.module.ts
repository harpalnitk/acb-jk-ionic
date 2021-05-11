import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcbPage } from './acb.page';

const routes: Routes = [
  {
    path: '',
    component: AcbPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcbPageRoutingModule {}
