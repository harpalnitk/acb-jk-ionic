import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  AppConfigService,
  MapData,
} from '../../../shared/services/app-config.service';
import { ComplaintSummaryComponent } from '../complaint-summary/complaint-summary.component';

@Component({
  selector: 'app-new-complaint',
  templateUrl: './new-complaint.component.html',
  styleUrls: ['./new-complaint.component.scss'],
})
export class NewComplaintComponent implements OnInit {
  complaintForm: FormGroup;
  desig: MapData[];
  dept: MapData[];
  constructor(
    private modalCtrl: ModalController,
    private appConfigService: AppConfigService
  ) {}

  ngOnInit() {
    this.initForm();
    this.dept = this.appConfigService.getComplaintsData('dept');
    this.desig = this.appConfigService.getComplaintsData('desig');
  }

  initForm() {
    this.complaintForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      desc: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      officials: new FormArray([], [Validators.required]),
      imageURL: new FormControl(null),
    });
  }

  get officials() {
    return this.complaintForm.get('officials') as FormArray;
  }
  addOfficial() {
    const group = new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      desig: new FormControl('', { validators: [Validators.required] }),
      dept: new FormControl('', { validators: [Validators.required] }),
    });

    this.officials.push(group);
  }
  removeOfficial(index: number) {
    this.officials.removeAt(index);
  }

  onImagePicked(imageURL: string) {
    console.log('imageURL in new complaint Component'), imageURL;
    this.complaintForm.patchValue({ imageURL: imageURL });
  }

  async onAddComplaint() {
    if (!this.complaintForm.valid) {
      return;
    }

    //below 2 lines of code needed because if we return from submit of summary modal
    // if await is not used below the system still has old summary modal on top
    // even though it has been dismissed
    const modal = await this.modalCtrl.getTop();
    console.log('modal', modal);

    this.modalCtrl.dismiss(
      {
        complaintData: {
          title: this.complaintForm.value['title'],
          desc: this.complaintForm.value['desc'],
          officials: this.complaintForm.value['officials'],
        },
        imageURL: this.complaintForm.value['imageURL'],
      },
      'confirm'
    );
  }

  async onViewSummary() {
    if (!this.complaintForm.valid) {
      return;
    }
    console.log('onViewSummary');
    const modal = await this.modalCtrl.create({
      component: ComplaintSummaryComponent,
      id: 'complaint-summary',
      componentProps: {
        title: this.complaintForm.value['title'],
        desc: this.complaintForm.value['desc'],
        officials: this.complaintForm.value['officials'],
        imageURL: this.complaintForm.value['imageURL'],
      },
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    console.log(`Data: ${data} Role: ${role}`);
    if (role === 'submit') {
      console.log(`Data: `, JSON.stringify(data));
      return this.onAddComplaint();
    }
    return;
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
