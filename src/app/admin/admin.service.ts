import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FBUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  disabled: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private nextPageToken;
  private resultSize = '9';
  private loadUsersFlag = true;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {}

  private _users = new BehaviorSubject<FBUser[]>(null);
  private _user = new BehaviorSubject<FBUser>(null);
  private _loading = new BehaviorSubject<boolean>(false);
  // private _loadingEdit = new BehaviorSubject<boolean>(false);
  private _loadingDelete = new BehaviorSubject<boolean>(false);
  private _loadingUser = new BehaviorSubject<boolean>(false);

  private userList: FBUser[] = [];

  get users() {
    return this._users.asObservable();
  }

  get user() {
    return this._user.asObservable();
  }

  get loading() {
    return this._loading.asObservable();
  }
  // get loadingEdit() {
  //   return this._loadingEdit.asObservable();
  // }
  get loadingDelete() {
    return this._loadingDelete.asObservable();
  }
  get loadingUser() {
    return this._loadingUser.asObservable();
  }

  resetNextPageToken() {
    console.log('Reset next page Token Called');
    this.nextPageToken = undefined;
    // if next page token is not returned from the server, we don't want to fetch nay more users
    this.loadUsersFlag = true;
    this.userList = [];
  }

  fetchUsers() {
    // console.log('Inside fetchUsers');
    // if(!this.loadUsersFlag){
    //   return;
    // }
    // const URL_FIREBASE_CLOUD_FUNCTION = 'https://us-central1-acb-jk-ionic.cloudfunctions.net/listUsers';
    // this._loading.next(true);
    // this.authService.token.pipe(
    //   take(1),
    //  //take(1) removed because if we reach this page initially then user is still null and this page runs
    //   switchMap(token => {
    //     //console.log('token', token);
    //     //Not using with authorization beacuase firebase doesn't allow it without billing
    //     return this.http.get<{ users: FBUser[], pageToken: string } | any>(`https://us-central1-acb-jk-ionic.cloudfunctions.net/listUsers`
    //       , { headers: { 'authorization': 'Bearer ' + token }, params: { 'nextPageToken': this.nextPageToken, 'resultSize': this.resultSize } });
    //   }),
    //   take(1),
    //   map(
    //     value => {
    //      // console.log('Return Value ', value);
    //      if(value.pageToken){
    //       console.log(`Next page Token :  ${this.nextPageToken}`);
    //       this.nextPageToken = value.pageToken;
    //      } else {
    //       console.log(`Next page Token not present`);
    //       this.nextPageToken = undefined;
    //       this.loadUsersFlag = false;
    //      }
    //       this.userList = this.userList.concat(value.users);
    //       this._users.next(this.userList);
    //        return this.userList;
    //     }
    //   )
    // ).subscribe(
    //   value => {
    //     this._loading.next(false);
    //     console.log(`User list fetched`, value)},
    //   err => {
    //     this._loading.next(false);
    //     console.log(`Error in fetching User List ${this.nextPageToken}`, err)},
    // );
  }

  deleteUser(userId: string) {
    // console.log('Delete user called');
    // const URL_FIREBASE_CLOUD_FUNCTION = 'https://us-central1-acb-jk-ionic.cloudfunctions.net/deleteUser';
    // this._loadingDelete.next(true);
    // return this.authService.token.pipe(
    //   take(1),
    //   switchMap(token => {
    //     //console.log(token);
    //     //Not using with authorization beacuase firebase doesn't allow it without billing
    //     return this.http.delete<{ res: string }>(URL_FIREBASE_CLOUD_FUNCTION
    //       , { headers: { 'authorization': 'Bearer ' + token }, params: { 'userId': userId}  });
    //   }), map(value => {
    //     this.userList = this.userList.filter(user => user.uid !== userId);
    //     this._users.next(this.userList);
    //     return value;
    //   })
    // ).subscribe(
    //   value => {
    //     this._loadingDelete.next(false);
    //     console.log(`User with Id ${userId} deleted successfully`)},
    //   err => {
    //     this._loadingDelete.next(false);
    //     console.log(`Error in deleting User with Id ${userId}`, err)},
    // );
  }

  getUser(userId: string) {
    console.log('userId');

    //  console.log('getUser  called');
    //  const URL_FIREBASE_CLOUD_FUNCTION = 'https://us-central1-acb-jk-ionic.cloudfunctions.net/getUser';
    //  this._loadingUser.next(true);
    //  return this.authService.token.pipe(
    //    take(1),
    //    switchMap(token => {
    //      //console.log(token);
    //      //Not using with authorization beacuase firebase doesn't allow it without billing
    //      return this.http.get<FBUser>(URL_FIREBASE_CLOUD_FUNCTION
    //        , { headers: { 'authorization': 'Bearer ' + token }, params: { 'userId': userId}  });
    //    }), map(value => {
    //     // this.userList = this.userList.filter(user => user.id !== userId);
    //      this._user.next(value);
    //      return value;
    //    })
    //  )
    //  .subscribe(
    //    value => {
    //      this._loadingUser.next(false);
    //      console.log(`User with Id ${userId} fetched successfully`)},
    //    err => {
    //      this._loadingUser.next(false);
    //      console.log(`Error in fetching User with Id ${userId}`, err)},
    //  );
  }

  editUser(userId: string, data: any) {
    // console.log(`in editUser userId:${userId} Data: ${data}`);
    // // console.log('Delete user called');
    //  const URL_FIREBASE_CLOUD_FUNCTION = 'https://us-central1-acb-jk-ionic.cloudfunctions.net/editUser';
    //  //this._loadingEdit.next(true);
    //  return this.authService.token.pipe(
    //    take(1),
    //    switchMap(token => {
    //      //console.log(token);
    //      //Not using with authorization beacuase firebase doesn't allow it without billing
    //      return this.http.patch<{ res: string }>(URL_FIREBASE_CLOUD_FUNCTION,
    //        data , { headers: { 'authorization': 'Bearer ' + token }, params: { 'userId': userId}  });
    //    }), map(value => {
    //     // this.userList = this.userList.filter(user => user.id !== userId);
    //      // this._users.next(this.userList);
    //      console.log('Value of edit user from server', value);
    //      return value;
    //    })
    //);
  }
}
