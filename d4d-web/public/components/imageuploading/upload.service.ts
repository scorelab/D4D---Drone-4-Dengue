//References
//https://angularfirebase.com/lessons/angular-file-uploads-to-firebase-storage/



import {Injectable} from '@angular/core';
import {AngularFire, AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import {Upload} from './upload';
import * as firebase from 'firebase';

@Injectable()
export class UploadService {
  constructor(private af: AngularFire, private db: AngularFireDatabase) { }

  private basePath:string = '/uploads';
  uploads: FirebaseListObservable;

  pushUpload(upload: Upload) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.saveFileData(upload)
      }
    );
  }