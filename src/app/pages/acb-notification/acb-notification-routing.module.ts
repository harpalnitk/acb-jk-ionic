import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcbNotificationPage } from './acb-notification.page';

const routes: Routes = [
  {
    path: '',
    component: AcbNotificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcbNotificationPageRoutingModule {}
