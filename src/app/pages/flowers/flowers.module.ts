import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlowersPageRoutingModule } from './flowers-routing.module';

import { FlowersPage } from './flowers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlowersPageRoutingModule
  ],
  declarations: [FlowersPage]
})
export class FlowersPageModule {}
