import { Nav, Platform, ionicBootstrap } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from './pages/home/home';
import { MapPage } from './pages/map/map';
import { Component, ViewChild } from '@angular/core';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';
import { AuthProvider } from './providers/auth/auth';
import { AuthPage } from './pages/auth/home/home';

@Component({
	templateUrl: 'build/app.html'
})

class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  isAppInitialized: boolean;
  constructor(private platform: Platform, protected auth: AuthProvider) {
    this.pages = [
      { title: "Home", component: HomePage },
      { title: "Map", component: MapPage },
    ];
    this.isAppInitialized = false;
  }

  ngOnInit() {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();

      this.auth.getUserData().subscribe(data => {
        if (!this.isAppInitialized) {
          this.nav.setRoot(HomePage);
          this.isAppInitialized = true;
        }
      }, err => {
        this.nav.setRoot(AuthPage);
      });
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [AuthProvider, FIREBASE_PROVIDERS,
  defaultFirebase({
    apiKey: "AIzaSyBBqGSM87SUaxc63qss49nVfkTT4K-9m5g",
    authDomain: "food-truck-finder-e5de5.firebaseapp.com",
    databaseURL: "https://food-truck-finder-e5de5.firebaseio.com",
    storageBucket: "food-truck-finder-e5de5.appspot.com",
  })], {
});