import { UIService } from './../../shared/services/ui.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { convertSnaps } from 'src/app/shared/utils';
import * as UIActions from '../../shared/store/ui.actions';
import * as NotificationActions from './store/notification.actions';
import * as fromNotification from './store/notification.reducer';
import * as fromRoot from '../../app.reducer';

export class ACBNotification {
  constructor(
    public title: string,
    public link: string,
    public date: Date,
    public desc?: string,
    public addedBy?: string,
    public id?: string
  ) {}
}

@Injectable()
export class NotificationService {
  notificationsCollection: AngularFirestoreCollection<ACBNotification>;
  notificationDoc: AngularFirestoreDocument<ACBNotification>;
  notifications$: Observable<any>;
  //currentUserId$: Observable<string>;
  //notifications$: Observable<any>;
  currentUserId;
  private subs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private store: Store<fromNotification.State>,
    private uiService: UIService
  ) {
    this.notificationsCollection = this.db.collection<ACBNotification>(
      'notifications'
    );
    this.notifications$ = this.notificationsCollection.snapshotChanges();
    -this.subs.push(
      this.store.select(fromRoot.getUserId).subscribe((userId) => {
        this.currentUserId = userId;
      })
    );
  }

  loadNotificationsSubscription() {
    //No need to unsubscribe as angular will replace
    //new subscription with old one automatically

    //  this.complaintsCollection = this.db.collection('complaints', ref =>
    //  ref.where('userId', '==', this.currentUserId).orderBy('date', 'desc').limit(10).startAt(10)
    //  );
    this.subs.push(
      this.notifications$
        .pipe(map((snaps) => convertSnaps<any>(snaps)))
        .subscribe(
          (res: any) => {
            console.log('Notifications with value changes', res);
            this.store.dispatch(new UIActions.StopLoading());
            if (res) {
              this.store.dispatch(
                new NotificationActions.SetNotifications(res)
              );
              // this.firstInResponse = res.firstInResponse;
              // this.lastInResponse = res.lastInResponse;
              // //Initialize values
              // //this.disable_next = false;
              // //this.disable_prev = false;

              // //Push first item to use for Previous action
              // if (this.changePageAction === 'load') {
              //   //Initialize values
              //   this.prev_strt_at = [];
              //   this.pagination_clicked_count = 0;
              //   this.push_prev_startAt(this.firstInResponse);
              // } else if (this.changePageAction === 'next') {
              //   this.push_prev_startAt(this.firstInResponse);
              //   this.pagination_clicked_count++;
              // } else {
              //   //Pop not required value in array
              //   this.pop_prev_startAt(this.firstInResponse);
              //   this.pagination_clicked_count--;
              //}
            } else {
              this.store.dispatch(new NotificationActions.SetNotifications([]));
            }
          },
          (err) => {
            this.store.dispatch(new UIActions.StopLoading());
            console.log('Error', err);
            this.uiService.presentToast('Error in fetching notifications!');
          }
        )
    );
  }

  async addNotification(title: string, link: string, desc?: string) {
    console.log('Service: In addNotification ', this.currentUserId);
    if (this.currentUserId) {
      this.uiService.presentLoading('Adding Notification...');
      const newNotification = new ACBNotification(
        title,
        link,
        new Date(),
        desc,
        this.currentUserId
      );
      delete newNotification.id;
      console.log('In add notification', JSON.stringify(newNotification));
      return this.notificationsCollection
        .add({ ...newNotification })
        .then((res) => {
          this.uiService.dismissLoading();
          this.uiService.presentToast('Notification submitted successfully!');
        })
        .catch((err) => {
          this.uiService.dismissLoading();
          this.uiService.presentToast(
            'Error in submitting notification. Please try again!'
          );
        });
    } else {
      this.uiService.presentToast('Please Login to submit notification!');
      return;
    }
  }
  cancelSubscriptions() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
