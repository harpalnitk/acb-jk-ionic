import { Component } from '@angular/core';
import { MapData, AppConfigService } from '../../services/app-config.service';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export interface RegionPickerValues {
  state: string;
  district: string;
  tehsil: string;
  address: string;
  pincode: string;
}

@Component({
  selector: 'app-region-picker',
  templateUrl: './region-picker.component.html',
  styleUrls: ['./region-picker.component.scss'],
})
export class RegionPickerComponent {
  states: MapData[];
  districts: MapData[];
  tehsils: MapData[];
  tehsilsPresent: boolean = false;
  subscriptions: Subscription[] = [];

  form: FormGroup;

  constructor(
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder
  ) {
    this.states = this.appConfigService.getStates();
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      state: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      district: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      tehsil: new FormControl(null, {
        updateOn: 'blur',
      }),
      address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      pincode: new FormControl(null, {
        updateOn: 'blur',
        //TODO change it to number validator
        validators: [Validators.pattern(/^[0-9]+[0-9]*$/)],
      }),
    });
    // this.form = this.formBuilder.group({
    //   state:'',
    //   district:'',
    //   tehsil:'',
    //   address:'',
    //   pincode:''
    // });

    // this.form.valueChanges.subscribe(
    //   value => {
    //     console.log('Value changed in RegionPickerForm', value);
    //   }
    // )
  }

  loadDistrict(stateId: string) {
    console.log('stateId ', stateId);
    this.districts = this.appConfigService.getDistricts(stateId);
    console.log('this.form', this.form);
  }

  get state(): any {
    return this.form.get('state').value;
  }

  loadTehsil(districtId: string) {
    console.log('this.form', this.form);
    console.log('districtId ', districtId);
    console.log('stateId ', this.state);
    let tehsils = this.appConfigService.getTehsils(this.state, districtId);
    console.log('tehsils', tehsils);
    if (tehsils) {
      console.log('tehsils', tehsils);
      this.tehsils = tehsils;
      this.tehsilsPresent = true;
    } else {
      this.tehsils = undefined;
      //this.tehsil ='';
      this.tehsilsPresent = false;
    }
  }
}
