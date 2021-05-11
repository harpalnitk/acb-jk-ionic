import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { presentLoading } from '../../../shared/utils';
import { Profile } from '../../../profile/profile.model';
import { ProfileService } from '../../../profile/profile.service';
import { AppConfigService } from '../../../shared/services/app-config.service';
import { Complaint } from '../../../shared/models/complaint.model';
import { UIService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss'],
})
export class ComplaintDetailComponent implements OnInit {
  @Input() complaint: Complaint;
  profile: Profile;
  profileSubscription: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private profileService: ProfileService,
    private uiService: UIService,
    private appConfigService: AppConfigService
  ) {
    this.appConfigService.loadStatesData();
  }

  ngOnInit() {
    this.uiService.presentLoading('Fetching Complaint Details');
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
}
