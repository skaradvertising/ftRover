import { NavController, Modal } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs';
import { OnInit, Inject, Component } from '@angular/core';
import { AuthPage } from '../auth/home/home';

@Component({
    templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
    items: FirebaseListObservable<any[]>;
    authInfo: any;
    member: FirebaseObjectObservable<any>;

    constructor(private navCtrl: NavController, private af: AngularFire) {}

    ngOnInit() {
        this.items = this.af.database.list('/textitems');

        this.af.auth.subscribe(data => {
            if(data) {
                this.authInfo = data;
                this.af.database.object('/users/roles/members/' + this.authInfo.uid).subscribe(userData => {
                    this.member = userData.displayName;
                });
            } else {
                this.authInfo = null;
                this.showLoginModal();
            }
        });
    }

    logout() {
        if(this.authInfo) {
            this.af.auth.logout();
            return;
        }
    }

    showLoginModal() {
        let loginPage = Modal.create(AuthPage);
        this.navCtrl.present(loginPage);
    }
}