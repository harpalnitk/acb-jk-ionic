import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Profile, ProfileConstants } from '../profile.model';
import { RegionPickerComponent } from '../../shared/pickers/region-picker/region-picker.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit, AfterViewInit {
  profileForm: FormGroup;
  @Input() profile: Profile;
  genders = ProfileConstants.GENDERS;
  @ViewChild(RegionPickerComponent)
  regionPickerComponent: RegionPickerComponent;

  constructor(
    private modalCtrl: ModalController,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.profileForm.addControl('address', this.regionPickerComponent.form);
    this.regionPickerComponent.form.setParent(this.profileForm);
    this.patchForm();
    //if not used angular will give error that changes made after content init
    this.cdref.detectChanges();
  }

  initForm() {
    this.profileForm = new FormGroup({
      displayName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      firstName: new FormControl(null, {
        updateOn: 'blur',
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
      }),
      gender: new FormControl('F'),
      about: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.maxLength(180)],
      }),
      // address: ,
      contact: new FormGroup({
        phones: new FormArray([]),
      }),
      photoURL: new FormControl(null),
    });
  }

  patchForm() {
    this.profileForm.patchValue({
      firstName: this.profile.firstName || null,
      lastName: this.profile.lastName || null,
      about: this.profile.about || null,
      displayName: this.profile.displayName || null,
      gender: this.profile['gender'] ? this.profile['gender'] : 'F',
      address: {
        state: this.profile['address'] ? this.profile.address['state'] : null,
        address: this.profile['address']
          ? this.profile.address['address']
          : null,
        pincode: this.profile['address']
          ? this.profile.address['pincode']
          : null,
      },
      photoURL: this.profile.photoURL || null,
    });

    if (this.profile['contact'] && this.profile.contact['phones']) {
      for (let i = 0; i < this.profile.contact.phones.length; i++) {
        this.phones.setControl(
          i,
          new FormControl(this.profile.contact.phones[i], [
            Validators.required,
            Validators.pattern(/^[0-9]+[0-9]*$/),
          ])
        );
      }
    }
    if (this.profile['address'] && this.profile.address['state']) {
      this.regionPickerComponent.loadDistrict(this.profile.address['state']);
      this.profileForm.patchValue({
        address: {
          district: this.profile.address['district']
            ? this.profile.address['district']
            : null,
        },
      });
      if (this.profile.address['district']) {
        this.regionPickerComponent.loadTehsil(this.profile.address['district']);
        this.profileForm.patchValue({
          address: {
            tehsil: this.profile.address['tehsil']
              ? this.profile.address['tehsil']
              : null,
          },
        });
      }
    }
  }
  get phones() {
    return this.profileForm.get('contact.phones') as FormArray;
  }

  onAddPhone() {
    this.phones.push(
      new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]+[0-9]*$/),
      ])
    );
  }

  onDeletePhone(index: number) {
    this.phones.removeAt(index);
  }

  onImagePicked(imageURL: string) {
    console.log('imageURL in new complaint Component'), imageURL;
    this.profileForm.patchValue({ photoURL: imageURL });
  }

  onEditProfile() {
    console.log('Profile Form before Submit', this.profileForm);
    if (!this.profileForm.valid) {
      return;
    }
    let newProfile: Profile = {
      firstName: this.profileForm.value['firstName'],
      lastName: this.profileForm.value['lastName'],
      gender: this.profileForm.value['gender'],
      about: this.profileForm.value['about'],
      userType: 'SU',
      photoURL: this.profileForm.value['photoURL'],
      displayName: this.profileForm.value['displayName'],
      address: this.profileForm.value['address'],
      contact: this.profileForm.value['contact'],
      official: null,
      email: this.profile.email,
      uid: this.profile.uid,
    };
    delete newProfile.uid; // unique can't be updated as per this APP POLICY
    delete newProfile.email; // unique can't be updated as per this APP POLICY
    this.modalCtrl.dismiss(
      {
        profile: newProfile,
      },
      'confirm'
    );
  }

  onClose() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    // when id is not provided it dismisses the top overlay

    // 'dismissed': true is the data which can be passed back to the
    // opening page from where modal was opened
    this.modalCtrl.dismiss(
      {
        dismissed: true,
      },
      'cancel'
    );
  }
}
