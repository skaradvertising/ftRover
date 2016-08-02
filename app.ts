import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {TestListPage} from './pages/test-list/test-list';
import {MapPage} from './pages/map/map';
import { TabsPage } from './pages/tabs/tabs';
import {FIREBASE_PROVIDERS, defaultFirebase, AngularFire, firebaseAuthConfig, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';

@Component({
  	template: '<ion-nav [root]="rootPage"></ion-nav>',
  	providers: [
  		FIREBASE_PROVIDERS,
  		defaultFirebase({
  			apiKey: "AIzaSyBBqGSM87SUaxc63qss49nVfkTT4K-9m5g",
        authDomain: "food-truck-finder-e5de5.firebaseapp.com",
        databaseURL: "https://food-truck-finder-e5de5.firebaseio.com",
        storageBucket: "food-truck-finder-e5de5.appspot.com",
  		}), 
  		firebaseAuthConfig({
  			provider: AuthProviders.Password,
  			method: AuthMethods.Password,
  			remember: 'default',
  			scope: ['email']
  		})
  	]
})
export class MyApp {
  	rootPage: any = TabsPage;
    items: FirebaseListObservable<any[]>;

  	constructor(platform: Platform, af: AngularFire) {
      this.items = af.database.list('/FoodTrucks');
	    platform.ready().then(() => {
	      	StatusBar.styleDefault();
    	});
  	}
}

ionicBootstrap(MyApp);
