import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Geolocation} from 'ionic-native';
import {Observable} from 'rxjs/Observable';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

import * as firebase from 'firebase';

declare var GeoFire: any

declare var google: any

@Component({
  	templateUrl: 'build/pages/map/map.html',
})
export class MapPage {
	map: any;
	ref: any;
	ftLocation: any;
	foodTruckData: any;

  	constructor(private nav: NavController, public af: AngularFire) {
  		this.map = null;
  		this.loadMap();

  		this.ref = firebase.database().ref();
		this.ftLocation = new GeoFire(this.ref.child('_geofire'));
  	}

  	loadMap(){

		let options = {timeout: 5000, enableHighAccuracy: true};

		navigator.geolocation.getCurrentPosition(

			(position) => {

				let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

				let mapOptions = {
					center: latLng,
					zoom: 15,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				}

				this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

				let marker = new google.maps.Marker({
		  			map: this.map,
		  			animation: google.maps.Animation.DROP,
		  			position: this.map.getCenter()
		  		});

		  		let geoQuery = this.ftLocation.query({
		  			center: [position.coords.latitude, position.coords.longitude],
		  			radius: 3.21869,
		  		});

		  		geoQuery.on("key_entered", (key, location) => {
		  			let item = {key:key, location: location};
		  			this.setMarker(item);	  			
		  		});
		  		

			},

			(error) => {
				console.log(error);
			}, options
		);
  	}

  	setMarker(markerLocation) {
  		let location = markerLocation.location;
  		let key = markerLocation.key;

  		if(location.length == 0) {
  			return;
  		}

  		let marker = new google.maps.Marker({
  			icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  			position: new google.maps.LatLng(location[0], location[1]),
  			optimized: true,
  			map: this.map,
  		});

  		this.ref.child('FoodTrucks').child(key).once("value", (snap) => {
  			let name = snap.val().name;
  			let address = snap.val().address;
  			let text = snap.val().text;
  			let infoWindow = new google.maps.InfoWindow({
  				content: 	'<h3>' + name + '</h3>' +
  							'<h4>' + address + '</h4>' +
  							'<p>' + text + '</p>'
  			});

  			marker.addListener('click', function() {
  				infoWindow.open(this.map, marker);
  			});
  		})
  	}
}
