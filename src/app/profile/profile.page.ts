import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Profile } from './profile.model';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProfileService } from './profile.service';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../shared/services/app-config.service';
import { switchMap } from 'rxjs/operators';
import { UIService } from '../shared/services/ui.service';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  id;
  profile: Profile;

  constructor(
    private modalCtrl: ModalController,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private appConfig: AppConfigService,
    private uiService: UIService
  ) {
    this.appConfig.loadStatesData();
  }

  ngOnInit() {
    this.uiService.presentLoading('Fetching Profile...');
    this.route.data.pipe(switchMap((data) => data.profile)).subscribe(
      (profile: Profile) => {
        if (profile) {
          this.profile = profile;
          this.uiService.dismissLoading();
        } else {
          this.uiService.presentToast('Please wait a little more!!!');
        }
      },
      (err) => {
        console.log(`Error in fecthing Profile`, err);
        this.uiService.dismissLoading();
      }
    );
  }

  async onEditProfile() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        profile: this.profile,
      },
      id: 'profile-modal',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    let dataString = JSON.stringify(data);
    console.log(`Data: ${dataString} Role: ${role}`);
    if (role === 'confirm') {
      const profile: Profile = data.profile;
      this.uiService.presentLoading('Saving Profile...');
      this.profileService.updateProfile(profile).then(
        () => {
          //this.loadingCtrl.dismiss();
          this.uiService.dismissLoading();
        },
        (err) => {
          this.uiService.dismissLoading();
          // this.loadingCtrl.dismiss();
        }
      );
    }
  }

  // async presentLoading() {
  //   const loading = await this.loadingCtrl.create({
  //     message: 'Saving Profile....',
  //     keyboardClose: true,
  //   });
  //   await loading.present();

  //   const { role, data } = await loading.onDidDismiss();
  //   console.log('Profile Saved!');
  // }

  ngOnDestroy(): void {
    this.uiService.dismissLoading();
  }
}
