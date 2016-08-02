import {Component, OnInit, Inject} from '@angular/core';
import {Modal, NavController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {LoginPage} from '../login/login';
import {MomentDate} from '../../pipes/MomentDate';
import 'rxjs';
import {AngularFire, AuthProviders, AuthMethods} from 'angularfire2';

@Component({
  templateUrl: 'build/pages/home/home.html',
  pipes: [MomentDate]
})

export class HomePage implements OnInit {
	textItems: Observable<any[]>;
	usersWithMessages: Observable<any[]>;
	authInfo: any
	displayName: any
	buttonTitle: "LOGIN"

  	constructor(
  		public af: AngularFire,
  		public navCtrl: NavController) {
  	}

  	ngOnInit() {
  		this.af.auth.subscribe((data) =>{
  			console.log("in auth subscribe", data)

  			if(data) {
  				this.af.auth.unsubscribe()

  				this.addOrUpdateUser(data)

  				if(data.auth.providerData[0].providerId === "facebook.com") {
  					this.authInfo = data.auth.providerData[0]
  					this.displayName = data.auth.providerData[0].displayName
  				} else if(data.google) {
  					this.authInfo = data.google
  					//this.authInfo.displayName = data.google.displayName
  				} else {
  					this.authInfo = data.auth || {}
  					this.displayName = data.auth.providerData[0].email
  				}
  			} else {
  				this.buttonTitle = "LOGIN"
  				this.authInfo = null
  				this.displayLoginModal()
  			}
  		})
  	}

  	addOrUpdateUser(_authData) {
  		const itemObservable = this.af.database.object('/users/' + _authData.displayName)
  		itemObservable.set({
  			"provider": _authData.auth.providerData[0].providerID,
  			"avatar": _authData.auth.photoURL || 'MISSING',
  			"displayName": _authData.auth.providerData[0].displayName || _authData.auth.email,
  		})
  	}

  	getMoreData() {
  		this.usersWithMessages = this.af.list('/users').map((_users) => {
  			return _users.map((_user) => {
  				_user.messages = this.af.object("/userObjects/public-messages" + _user.$key)
  				return _user
  			})
  		})
  	}

  	displayLoginModal() {
  		let loginPage = Modal.create(LoginPage);
  		this.navCtrl.present(loginPage);
  	}
}
