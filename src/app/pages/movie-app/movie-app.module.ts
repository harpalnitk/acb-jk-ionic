import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovieAppPageRoutingModule } from './movie-app-routing.module';

import { MovieAppPage } from './movie-app.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovieAppPageRoutingModule
  ],
  declarations: [MovieAppPage]
})
export class MovieAppPageModule {}
