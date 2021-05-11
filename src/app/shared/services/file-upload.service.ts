import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Injectable()
export class FileUploadService {
  downloadUrlObservable: Observable<string>;
  // imageURL: string;
  uploads: AngularFirestoreCollection<any>;

  constructor(
    private afs: AngularFirestore,
    private fs: AngularFireStorage) {

  }

  uploadTask(path: string, file: File, meta: any, uploadType: boolean) {
    console.log(`Path: ${path} Meta: ${meta}`)
    const nameHash = Md5.hashStr(file.name + new Date().getTime());
    const fileExt = file.type.split('/')[1];
    const fileName = `${nameHash}.${fileExt}`;
    const fileRef = this.fs.ref(`${path}/${fileName}`);
    const newMeta = {...meta, someMoreData: 'More Data'}
    this.uploads = this.afs.collection(path);
    const task = fileRef.put(file, { customMetadata: newMeta });
    
    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadUrlObservable = fileRef.getDownloadURL();
        if (uploadType == true) {
          //Saves as collection
          this.downloadUrlObservable.pipe(take(1)).subscribe(url => {
            console.log('Saved as collection');
            const data = { name: fileName, url };
            this.uploads.add(data);
          });
        } else {
          //  Saves as document field
          this.downloadUrlObservable.pipe(take(1)).subscribe(url => {
            console.log('Saved as document field');
            //const data = { name: fileName, url };
            this.afs.doc(path).update({ url });
          });
        }
      })
    ).subscribe()

  }


}
