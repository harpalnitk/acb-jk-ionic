import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarRentalPageRoutingModule } from './car-rental-routing.module';

import { CarRentalPage } from './car-rental.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarRentalPageRoutingModule
  ],
  declarations: [CarRentalPage]
})
export class CarRentalPageModule {}
