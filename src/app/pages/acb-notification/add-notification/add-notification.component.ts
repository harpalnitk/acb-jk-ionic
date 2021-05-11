import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss'],
})
export class AddNotificationComponent implements OnInit {
  notificationForm: FormGroup;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.notificationForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      desc: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      link: new FormControl(null, Validators.required),
    });
  }

  onFilePicked(linkURL: string) {
    console.log('docURL in add notification Component', linkURL);
    this.notificationForm.patchValue({ link: linkURL });
  }

  async onAddNotification() {
    if (!this.notificationForm.valid) {
      return;
    }

    //below 2 lines of code needed because if we return from submit of summary modal
    // if await is not used below the system still has old summary modal on top
    // even though it has been dismissed
    const modal = await this.modalCtrl.getTop();
    console.log('modal', modal);

    this.modalCtrl.dismiss(
      {
        notificationData: {
          title: this.notificationForm.value['title'],
          desc: this.notificationForm.value['desc'],
          link: this.notificationForm.value['link'],
        },
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
