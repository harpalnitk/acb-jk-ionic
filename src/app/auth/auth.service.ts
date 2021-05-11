import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
//Note this import is very important
// don't import directly from firebase it will not work
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { Md5 } from 'ts-md5/dist/md5';
import { Router } from '@angular/router';
import * as fromRoot from '../app.reducer';
import * as AuthActions from './store/auth.actions';
import { Store } from '@ngrx/store';
import { UIService } from '../shared/services/ui.service';
import { ComplaintsService } from '../home/complaints/complaints.service';

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User | null>;
  authState: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private store: Store<fromRoot.State>,
    private uiService: UIService,
    private complaintsService: ComplaintsService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      this.authState = user;
      if (user) {
        this.store.dispatch(new AuthActions.SetAuthenticated(user.uid));
        this.router.navigate(['/home']);
      } else {
        this.store.dispatch(new AuthActions.SetUnauthenticated(null));
        //this.trainingService.cancelSubscriptions();
        this.router.navigate(['/auth']);
      }
    });
  }

  // // Returns true if user is logged in
  // get authenticated(): boolean {
  //   return this.authState !== null;
  // }

  // // Returns current user data
  // get currentUser(): any {
  //   return this.authenticated ? this.authState : null;
  // }

  // // Returns
  // get currentUserObservable(): any {
  //   return this.afAuth.authState
  // }

  // // Returns current user UID
  // get currentUserId(): string {
  //   return this.authenticated ? this.authState.uid : null;
  // }
  // Anonymous User
  // get currentUserAnonymous(): boolean {
  //   return this.authenticated ? this.authState.isAnonymous : false
  // }

  // Returns current user display name or Guest
  // get currentUserDisplayName(): string {
  //   if (!this.authState) { return 'Guest' }
  //   else if (this.currentUserAnonymous) { return 'Anonymous' }
  //   else { return this.authState['displayName'] || 'User without a Name' }
  // }

  login(email: string, password: string) {
    this.uiService.presentLoading('Logging In...');
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.uiService.dismissLoading();
        this.uiService.presentToast('You have successfully signed in');
        return true;
      })
      .catch((error) => {
        this.uiService.dismissLoading();
        this.uiService.presentToast(
          'Error in Log In. Please try again...',
          error.message
        );
        console.log('Error in Log In', error.message);
        return false;
      });
  }

  signup(email: string, password: string) {
    this.uiService.presentLoading('Logging In...');
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        this.uiService.dismissLoading();
        return this.updateUserData(response.user);
      })
      .then(() => {
        this.uiService.presentToast('Welcome, your account has been created!');
        return true;
      })
      .then(async (response) => {
        (await this.afAuth.currentUser)
          .sendEmailVerification()
          .then(() => {
            this.uiService.presentToast('We sent you an email verification');
            return true;
          })
          .catch((error) => {
            this.uiService.presentToast(
              'Error in sending verification email',
              error.message
            );
            return false;
          });
      })
      .catch((error) => {
        this.uiService.dismissLoading();
        this.uiService.presentToast(
          'Error in sign up. Please try again...',
          error.message
        );
        return false;
      });
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    const data: User = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName,
      photoURL:
        user.photoURL ||
        'http://gravatar.com/avatar/' + Md5.hashStr(user.uid) + '?d=identicon',
    };
    userRef.set(data, { merge: true });
    return true;
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      this.uiService.presentToast('You have successfully logged out!');
      this.complaintsService.cancelSubscriptions();
      this.router.navigate(['/']);
    });
  }
  // Sends email allowing user to reset password
  resetPassword(email: string) {
    return this.afAuth
      .sendPasswordResetEmail(email)
      .then(() => console.log('email sent'))
      .catch((error) => console.log(error));
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.socialLogin(provider);
  }
  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.socialLogin(provider);
  }
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.socialLogin(provider);
  }
  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.socialLogin(provider);
  }

  private socialLogin(provider) {
    return this.afAuth
      .signInWithRedirect(provider)
      .then((credential: any) => {
        console.log(
          `Credential in Social Login: ${JSON.stringify(credential)}`
        );
        return this.updateUserData(credential.user);
      })
      .catch((err) => console.log(err.message));
  }
}
