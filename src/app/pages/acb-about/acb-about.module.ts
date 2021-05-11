import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcbAboutPageRoutingModule } from './acb-about-routing.module';

import { AcbAboutPage } from './acb-about.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcbAboutPageRoutingModule
  ],
  declarations: [AcbAboutPage]
})
export class AcbAboutPageModule {}
