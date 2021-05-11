import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { base64toBlob } from '../../utils';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit, OnDestroy {
  uploading = false;
  subscriptions: Subscription[] = [];

  selectedImage: string;
  //THE IMAGE DOWNLOADABLE URL TO BE EMITTED
  //AFTER THE IMAGE FILE HAS BEEN UPLOADED ON FirebaseStorage
  @Output() outputImageURL = new EventEmitter<string>();
  
  @Input() inputPath: string = 'uploads';
  @Input() inputMetaData: any = {};

  uploads: AngularFirestoreCollection<any>;
  // on desktop devices without camera we need to provide file picker for
  //picture functionality
  usePicker= false;
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
// To clear the image and static location pictures when
// we visit the form page of new-place entry again
  @Input() showPreview = false;
  constructor(private platform: Platform,
    private fs: AngularFireStorage,
    private afs: AngularFirestore,) { }

  ngOnInit() { 
    // console.log('Mobile:',this.platform.is('mobile'));
    // console.log('Hybrid:',this.platform.is('hybrid'));
    // console.log('iOS:',this.platform.is('ios'));
    // console.log('Android:',this.platform.is('android'));
    // console.log('Desktop:',this.platform.is('desktop'));
    if((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')){
          this.usePicker = true;
    }
  }

  async onPickImage() {
   // if (!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
     //By using Desktop camera and ionic-PWA elements enabled see readme.txt file
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    // If desktop has no camera it will automatically provide file picker option
    //we don't need to use ours
    try{
      const image = await Plugins.Camera.getPhoto({
        quality: 50,
        source: CameraSource.Prompt,
        correctOrientation: true,
        height: 320,
        width: 200,
        resultType: CameraResultType.Base64
      });
    //  console.log('Image from Camera Plugin', image);
      this.selectedImage = 'data:image/jpeg;base64,'+image.base64String; 
      this.onImagePicked(image.base64String);

    }catch(err){
console.log('error in taking Photo',err);
// In case of any error we will use our file picker option
if(this.usePicker){
  this.filePickerRef.nativeElement.click();
}

return false;
    }

  }
// fallback method of choosing file when device does not have camera
  onFileChosen(event: Event){
console.log(event);
const pickedFile = (event.target as HTMLInputElement).files[0];
if(!pickedFile){
  //show an alert message
  return;
}
//converting file data to base64 format
const fr = new FileReader();
//FileReader is asynchronous operation//takes time
//thus using on load method and anonymous function
fr.onload = () => {
 const dataUrl = fr.result.toString();
 this.selectedImage = dataUrl;
 this.onImagePicked(pickedFile);
}
fr.readAsDataURL(pickedFile);//fr.onload will be called after this line is executed
//but it need o be defined before as it is an anonymous function
  }

  //WHEN FILE HAS BEEN SELECTED
  onImagePicked(imageData: string | File) {
    console.log('Image Picked');
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
    this.uploadFile(imageFile);

  }

  public uploadFile(file: File){
   // console.log('Input path', this.inputPath);
   // console.log('Input metaData', this.inputMetaData);
   
   const nameHash = Md5.hashStr(file.name + new Date().getTime());
   const fileExt = file.type.split('/')[1];
   const fileName = `${nameHash}.${fileExt}`;
  // console.log('fileName', fileName);
   const fileRef = this.fs.ref(`${this.inputPath}/${fileName}`);
  
   const task = fileRef.put(file, { customMetadata: this.inputMetaData })
 ;

   this.uploads = this.afs.collection(this.inputPath);
    // observe the percentage changes
    this.subscriptions.push(
      task.percentageChanges().subscribe(percentage => {
       // console.log('percentage', percentage);
        if (percentage < 100) {
          this.uploading = true;
        } else {
          this.uploading = false;
        }
      },
      err => {
        this.uploading = false;
        console.log('Error in uploading image', err.message);
      })
    );
    // get notified when download Url is available
    this.subscriptions.push(
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          //console.log('snapshotChanges Finalize');
           let downloadUrlObservable = fileRef.getDownloadURL();
            downloadUrlObservable.pipe(take(1)).subscribe(url => {
             // console.log('Download URL', url);
              this.outputImageURL.emit(url);
              //We will also store the uploadURL in a spearate
              //table; Table name will be defined by the
              //inputPath variable
              const data = { name: fileName, url };
              this.uploads.add(data);
             // console.log('Data uploaded in table', data);
            });
        })).subscribe()
        );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
     // console.log('Subscription in image picker being destroyed', sub);
      sub.unsubscribe();
    });
  }


}
