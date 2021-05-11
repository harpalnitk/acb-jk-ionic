import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { isUndefined } from 'util';

@Component({
  selector: 'app-doc-picker',
  templateUrl: './doc-picker.component.html',
  styleUrls: ['./doc-picker.component.scss'],
})
export class DocPickerComponent implements OnInit {
  uploading = false;
  subscriptions: Subscription[] = [];
  sizeError = false;
  typeError = false;

  fileName: string;
  fileExt: string;
  fileSize: number;
  //THE DOC DOWNLOADABLE URL TO BE EMITTED
  //AFTER THE DOC FILE HAS BEEN UPLOADED ON FirebaseStorage
  @Output() outputDocURL = new EventEmitter<string>();

  @Input() inputPath: string = 'uploads';
  @Input() inputMetaData: any = {};
  //? Max size in Kilobytes; Default set to 2 Kilobytes
  @Input() maxSize: number = 2 * 1024;

  uploads: AngularFirestoreCollection<any>;

  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;

  constructor(private fs: AngularFireStorage, private afs: AngularFirestore) {}

  ngOnInit() {
    this.resetValues();
  }

  resetValues() {
    this.typeError = false;
    this.sizeError = false;
    this.fileName = undefined;
    this.fileExt = undefined;
    this.fileSize = undefined;
  }

  // fallback method of choosing file when device does not have camera
  onFileChosen(event: Event) {
    this.resetValues();
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      //TODO show an alert message
      return;
    }
    this.fileSize = pickedFile.size / 1024;
    console.log('maxSize', this.maxSize);
    if (this.fileSize > this.maxSize || this.fileSize <= 0) {
      this.sizeError = true;
      return;
    }
    const nameHash = Md5.hashStr(pickedFile.name + new Date().getTime());
    this.fileExt = pickedFile.type.split('/')[1];
    console.log('File extnsion: ', this.fileExt);
    if (
      !(
        this.fileExt == 'doc' ||
        this.fileExt == 'msword' ||
        this.fileExt == 'docx' ||
        this.fileExt == 'pdf' ||
        this.fileExt ==
          'vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ) {
      this.typeError = true;
      return;
    }
    this.fileName = `${nameHash}.${this.fileExt}`;
    console.log('fileName', this.fileName);
    this.uploadFile(pickedFile);
  }

  public uploadFile(file: File) {
    const fileRef = this.fs.ref(`${this.inputPath}/${this.fileName}`);
    const task = fileRef.put(file, { customMetadata: this.inputMetaData });
    // observe the percentage changes
    this.subscriptions.push(
      task.percentageChanges().subscribe(
        (percentage) => {
          // console.log('percentage', percentage);
          if (percentage < 100) {
            this.uploading = true;
          } else {
            this.uploading = false;
          }
        },
        (err) => {
          this.uploading = false;
          console.log('Error in uploading image', err.message);
        }
      )
    );
    
    // get notified when download Url is available
    this.subscriptions.push(
      // get notified when the download URL is available
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            //console.log('snapshotChanges Finalize');
            let downloadUrlObservable = fileRef.getDownloadURL();
            downloadUrlObservable.pipe(take(1)).subscribe((url) => {
              console.log('Download URL', url);
              this.outputDocURL.emit(url);
            });
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      console.log('Subscription in doc picker being destroyed', sub);
      sub.unsubscribe();
    });
  }
}
