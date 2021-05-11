import { CorePageModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcbPageRoutingModule } from './acb-routing.module';

import { AcbPage } from './acb.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CorePageModule,
    SharedModule,
    AcbPageRoutingModule,
  ],
  declarations: [AcbPage],
})
export class AcbPageModule {}
