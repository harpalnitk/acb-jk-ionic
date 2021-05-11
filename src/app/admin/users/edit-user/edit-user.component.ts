import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { base64toBlob } from 'src/app/shared/utils';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit, OnDestroy, AfterViewInit {
  userForm: FormGroup;
  user: any;
  userSubscription: Subscription;
  loading$: Observable<boolean>;
  changePassword = false;
  @Input() userId: string;
  
  constructor(private modalCtrl: ModalController,
     private cdref: ChangeDetectorRef,
     private adminService:AdminService) { }


  ngOnInit() {
    console.log('UserId:', this.userId);
    this.initForm();
    this.userSubscription = this.adminService.user.subscribe(
      user => {
        console.log('User fetched from Admin Service in Edit Component', user);
        this.user = user;
        this.patchForm();
      }
    );
    this.loading$ = this.adminService.loadingUser.pipe(
      shareReplay()
    );
  }

  ngAfterViewInit() {
      this.adminService.getUser(this.userId);
      this.cdref.detectChanges();
  }

  togglePassword(){
    this.changePassword = !this.changePassword;
    this.userForm.patchValue({
      password: ''
    });
  }

  initForm(){
    this.userForm = new FormGroup({
      displayName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null,{
        validators: [Validators.minLength(6)]}),
      disabled: new FormControl(null),
      photoURL: new FormControl(null),
      image: new FormControl(null)
    });
  }

  patchForm(){
   if(this.user){
    this.userForm.patchValue({
      displayName : this.user.displayName,
      password: this.user.password,
      photoURL: this.user.photoURL,
      disabled: this.user.disabled,
    });
   }

  }

  onEditUser(){
    if(!this.userForm.valid){
      return;
    }

    this.modalCtrl.dismiss({
      'userData': {
        password: this.userForm.value['password'],
        displayName: this.userForm.value['displayName'],
        disabled: this.userForm.value['disabled'],
        photoURL: this.userForm.value['photoURL']
           },
      'image': this.userForm.value['image']
    },'confirm');
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      // data:image/jpeg;base64 is a prefix which images captured 
      //by the camera plugin have before them
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (error) {
        console.log('Error in converting base64 string to file', error);
        return;
      }
    } else {
      imageFile = imageData;
    }
   // console.log('imageFile', imageFile);
    //Saved file to the Form// Note: Form is not submitted till yet 
    this.userForm.patchValue({ image: imageFile });
  }

  onClose(){
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    // when id is not provided it dismisses the top overlay
    // 'dismissed': true is the data which can be passed back to the 
    // opening page from where modal was opened
    this.modalCtrl.dismiss({
      'dismissed': true
    },'cancel');
  }

  ngOnDestroy(): void {
   if(this.userSubscription){
     this.userSubscription.unsubscribe();
   }
  }
}
