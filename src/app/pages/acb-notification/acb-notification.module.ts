import { AddNotificationComponent } from './add-notification/add-notification.component';
import { StoreModule } from '@ngrx/store';
import { NotificationService } from './notification.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcbNotificationPageRoutingModule } from './acb-notification-routing.module';

import { AcbNotificationPage } from './acb-notification.page';
import { notificationReducer } from './store/notification.reducer';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule,
    AcbNotificationPageRoutingModule,
    StoreModule.forFeature('notification', notificationReducer),
  ],
  declarations: [AcbNotificationPage, AddNotificationComponent],
  providers: [NotificationService],
})
export class AcbNotificationPageModule {}
