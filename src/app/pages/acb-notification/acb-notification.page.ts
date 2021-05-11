import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNotificationComponent } from './add-notification/add-notification.component';
import { ACBNotification, NotificationService } from './notification.service';
import * as fromNotification from './store/notification.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import * as fromNotifications from './store/notification.reducer';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-acb-notification',
  templateUrl: './acb-notification.page.html',
  styleUrls: ['./acb-notification.page.scss'],
})
export class AcbNotificationPage implements OnInit {
  notifications$: Observable<ACBNotification[]>;
  isLoading$: Observable<boolean>;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  constructor(
    private modalCtrl: ModalController,
    private notificationService: NotificationService,
    private store: Store<fromNotification.State>
  ) {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.notifications$ = this.store.select(fromNotifications.getNotifications);
  }

  ngOnInit() {
    this.notificationService.loadNotificationsSubscription();
  }

  async onAddNotification() {
    console.log('onAddNotification');
    const modal = await this.modalCtrl.create({
      component: AddNotificationComponent,
      id: 'add-notification',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const notificationData = data.notificationData;
      return this.notificationService.addNotification(
        notificationData.title,
        notificationData.link,
        notificationData.desc
      );
    }
  }

  loadData(event) {
    // load more data
    this.next();

      //Hide Infinite List Loader on Complete
      event.target.complete();

      //Rerender Virtual Scroll List After Adding New Data
      this.virtualScroll.checkEnd();

    // CALL WHEN THERE IS NO DATA TO LOAD
    //event.target.disabled = true;
  }

  next() {}
  prev() {}
}
