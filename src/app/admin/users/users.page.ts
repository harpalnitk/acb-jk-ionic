import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonInfiniteScroll,
  IonItemSliding,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ProfileService } from 'src/app/profile/profile.service';
import { presentLoading } from 'src/app/shared/utils';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminService } from '../admin.service';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
  users$: Observable<any>;
  error = false;
  isLoading = false;
  loading$: Observable<boolean>;
  //loadingEditSubscription: Subscription;
  loadingDeleteSubscription: Subscription;
  loadNewUsersFlag = false;
  //fetchUsersSubscription: Subscription;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  constructor(
    private adminService: AdminService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private profileService: ProfileService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    console.log('Inside ngonInit');
    this.isLoading = true;
    this.error = false;
    this.users$ = this.adminService.users;
    this.loading$ = this.adminService.loading.pipe(
      shareReplay(),
      tap((value) => {
        if (!value && this.loadNewUsersFlag) {
          this.infiniteScroll.complete();
          this.loadNewUsersFlag = false;
        }
      })
    );

    this.loadingDeleteSubscription = this.adminService.loadingDelete
      .pipe(
        tap((value) => {
          if (value) {
            // presentLoading('Deleting User', 'User Deleted', this.loadingCtrl);
          }
          if (!value) {
            //This will give an error for the first time as initial value is false in loadingDeleteSubject
            // and there is no overlay present
            this.loadingCtrl.dismiss();
          }
        })
      )
      .subscribe();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.adminService.resetNextPageToken();
    this.adminService.fetchUsers();
  }

  loadNewUsers() {
    this.loadNewUsersFlag = true;
    console.log(' loadNewUsers called', this.loadNewUsersFlag);
    this.adminService.fetchUsers();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
    //because every time we switch between tabs it creates multiple fetch user subscriptions
    // if(this.fetchUsersSubscription){
    //   this.fetchUsersSubscription.unsubscribe();
    // }
  }

  async onEditUser(userId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    console.log('onEditUser called userId:', userId);
    const modal = await this.modalCtrl.create({
      component: EditUserComponent,
      componentProps: {
        userId: userId,
      },
      id: 'edit-user',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(`Data: ${data} Role: ${role}`);
    console.log(`Data: `, JSON.stringify(data));
    if (role === 'confirm') {
      // const bookingData = data.bookingData;
      // presentLoading('Editing User', 'User Edited successfully', this.loadingCtrl);
      //this.adminService.editUser(userId, data.userData);
      const userData = data.userData;
      let editObservable: any;
      // presentLoading('Editing User', 'User Edited', this.loadingCtrl);
      if (data.image) {
        // editObservable = this.sharedService.uploadImage(data.image).pipe(
        //   take(1),
        //   switchMap((upLoadRes: any) => {
        //     userData.photoURL = upLoadRes.imageUrl;
        //     return this.adminService.editUser(userId, userData);
        //   })
        // );
      } else {
        editObservable = this.adminService.editUser(userId, userData);
      }

      if (editObservable) {
        editObservable.subscribe(
          (value) => {
            console.log('Value returned from server on edit user', value);
            this.loadingCtrl.dismiss();
          },
          (err) => {
            console.log('Error in editing User', err);
            this.loadingCtrl.dismiss();
          }
        );
      }
    }
    return;
  }

  onDeleteUser(userId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel Booking with BookinId
    //presentLoading('Deleting User', 'User Deleted', this.loadingCtrl);
    this.adminService.deleteUser(userId);
  }

  showUserDetail(userId: string) {
    console.log('Show User Detail Called');
  }

  ngOnDestroy(): void {
    // if(this.loadingEditSubscription){
    //   this.loadingEditSubscription.unsubscribe();
    // }
    if (this.loadingDeleteSubscription) {
      this.loadingDeleteSubscription.unsubscribe();
    }
  }
}
