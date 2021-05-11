import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieAppPage } from './movie-app.page';

const routes: Routes = [
  {
    path: '',
    component: MovieAppPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovieAppPageRoutingModule {}
