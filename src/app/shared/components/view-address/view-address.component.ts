import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Profile } from '../../../profile/profile.model';
import { AppConfigService } from '../../services/app-config.service';

@Component({
  selector: 'app-view-address',
  templateUrl: './view-address.component.html',
  styleUrls: ['./view-address.component.scss'],
})
export class ViewAddressComponent implements OnInit, OnChanges {
  @Input() profile: Profile;
  state;
  district;
  tehsil;
  constructor(private appConfig: AppConfigService) {
    this.appConfig.loadStatesData();
  }

  ngOnInit() {
    // if (this.profile && this.profile.address) {
    //   this.getAddressViewValues();
    // }
    // console.log('Profile in Profile Page', this.profile);
  }
  getAddressViewValues() {
    let viewValues = this.appConfig.getViewValues(
      this.profile?.address?.state,
      this.profile?.address?.district,
      this.profile?.address?.tehsil
    );
    this.state = viewValues.state;
    this.district = viewValues.district;
    this.tehsil = viewValues.tehsil;
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('Inside ngOnChanges');
    if (this.profile && this.profile.address) {
      this.getAddressViewValues();
    }
  }
}
