import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseObjectObservable} from 'angularfire2';
import {Geolocation} from 'ionic-native';

import * as firebase from 'firebase';

declare var GeoFire: any

declare var google: any

@Component({
    templateUrl: 'build/pages/test-list/test-list.html',
})

export class TestListPage {
    ref: any;
    gfLocation: any;
    items: any;
    geoQuery: any;
    
    constructor(public af: AngularFire) {
        this.ref = firebase.database().ref();
        this.gfLocation = new GeoFire(this.ref.child('_geofire'));
        this.initList();
        this.items = [];
        this.geoQuery = null;
    }

    initList() {
        let options = {timeout: 5000, enableHighAccuracy: true};

        navigator.geolocation.getCurrentPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;

                this.geoQuery = this.gfLocation.query({
                    center: [lat,lng],
                    radius: 3.21869
                });

                this.geoQuery.on("key_entered", (key) => {
                    let item = {key: key};
                    this.getData(item.key);
                });
            }
        );

        
    }

    getData(key) {
        this.ref.child('FoodTrucks').child(key).once("value", (snap) => {
            let item = snap.val();
            this.items.push(item);
        });
    }
}
