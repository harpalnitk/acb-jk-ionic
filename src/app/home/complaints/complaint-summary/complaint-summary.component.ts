import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Profile } from '../../../profile/profile.model';
import { ProfileService } from '../../../profile/profile.service';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-complaint-summary',
  templateUrl: './complaint-summary.component.html',
  styleUrls: ['./complaint-summary.component.scss'],
})
export class ComplaintSummaryComponent implements OnInit, OnDestroy {
  @Input() title: string;
  @Input() desc: string;
  @Input() officials: any;
  @Input() imageURL: any;
  imageUrl: string;
  date: Date;
  profile: Profile;
  profileSubscription: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private profileService: ProfileService,
    private appConfigService: AppConfigService,
    private uiService: UIService
  ) {
    this.appConfigService.loadStatesData();
  }

  ngOnInit() {
    // if(this.imageURL) {
    //  // this.imageUrl = 'data:image/jpeg;base64,'+ this.image.base64String;
    //   //this.imageUrl = 'data:image/jpeg;base64,'+ Base64.encode(this.image);
    //   //this.imageUrl = URL.createObjectURL(this.image);
    // }
    this.date = new Date();
    this.uiService.presentLoading('Generating Complaint Summary');
    this.profileSubscription = this.profileService.getProfileData().subscribe(
      (profile) => {
        this.profile = profile;
        this.uiService.dismissLoading();
      },
      (err) => this.uiService.dismissLoading()
    );
  }
  onClose() {
    this.modalCtrl.dismiss(
      {
        dismissed: true,
      },
      'cancel'
    );
  }
  onSubmit() {
    this.modalCtrl.dismiss(
      {
        dismissed: true,
      },
      'submit'
    );
  }
  ngOnDestroy(): void {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }
}
