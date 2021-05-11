import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
//THE SPLASH SCREEN AND STATUS BAR ARE FRO CORDOVA
//BUT WE WILL USE CAPACITOR
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthService, User } from './auth/auth.service';
import { Observable, Subscription } from 'rxjs';

//We added an "Auto Logout" functionality to the app in this module.
//You could also check the authentication status when the app resumes - to make sure that the user is logged out even if the app was running in the background (of course only, if the token did invalidate in the meantime).
//Acting when the app resumes is easy - you can use Capacitor for that:
//imports from capacitor
//plugins is an object that bundles all the plugins exposed by capacitor
import { Plugins, Capacitor } from '@capacitor/core';

import { UIService } from './shared/services/ui.service';
import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { shareReplay, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuth$: Observable<boolean>;
  user$: Observable<User | null>;
  subs: Subscription[] = [];
  placeholderAvatar = 'assets/images/avatar/girl-avatar.png';

  menuList = [{
    id: 1,
    routerLink:'/home/tabs/acb',
    iconName:'business',
    label:'Home',
    auth: ''
  },
  {
    id:2,
    routerLink:'/auth',
    iconName:'business',
    label:'Login',
    auth: 'false'
  },
  {
    id:3,
    routerLink:'/profile',
    iconName:'business',
    label:'Profile',
    auth: 'true'
  },
  {
    id:3,
    routerLink:'/restaurant',
    iconName:'business',
    label:'Restaurant',
    auth: 'true'
  },
  {
    id:4,
    routerLink:'/car-rental',
    iconName:'business',
    label:'Car-rental',
    auth: 'true'
  },
  {
    id:5,
    routerLink:'/movie-app',
    iconName:'business',
    label:'Movie-App',
    auth: 'true'
  },
  {
    id:6,
    routerLink:'/pokemon',
    iconName:'business',
    label:'Pokemon',
    auth: 'true'
  },
  {
    id:5,
    routerLink:'/flowers',
    iconName:'business',
    label:'Flowers',
    auth: 'true'
  },
  {
    id:5,
    routerLink:'/covid',
    iconName:'business',
    label:'Covid',
    auth: 'true'
  },
]

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth).pipe(
      //because auth is subscribed many times on the screen
      //shareReplay() shares the result of one subscription across all instances
      shareReplay()
    );
    this.user$ = this.authService.user$.pipe(shareReplay());
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      // console.log('initializeApp');
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
    this.authService.initAuthListener();
  }

  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
