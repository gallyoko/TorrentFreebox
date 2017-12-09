import { Injectable } from '@angular/core';
import { App, NavController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {

    private loader: any = null;

    constructor(public app: App, public navCtrl: NavController, public storage: Storage, public platform: Platform,
                public loadingCtrl: LoadingController, public toastCtrl: ToastController,
                public spinnerDialog: SpinnerDialog, public toast: Toast) {
        
    }

    setToken(token) {
        return Promise.resolve(this.storage.set('token', token));
    }

    getToken() {
        return Promise.resolve(this.storage.get('token'));
    }

    setTrackId(trackId) {
        return Promise.resolve(this.storage.set('trackId', trackId));
    }

    getTrackId() {
        return Promise.resolve(this.storage.get('trackId'));
    }

    setGranted(granted) {
        return Promise.resolve(this.storage.set('granted', granted));
    }

    getGranted() {
        return Promise.resolve(this.storage.get('granted'));
    }

    setTokenSession(tokenSession) {
        return Promise.resolve(this.storage.set('tokenSession', tokenSession));
    }

    getTokenSession() {
        return Promise.resolve(this.storage.get('tokenSession'));
    }

    removeTokenSession() {
        return Promise.resolve(this.storage.remove('tokenSession'));
    }

    loadingShow(message) {
        if (this.platform.is('cordova')) {
            this.spinnerDialog.show(null, message);
        } else {
            let loading = this.loadingCtrl.create({
                content: message
            });
            this.loader = loading;
            this.loader.present();
        }
    }

    loadingHide() {
        if (this.platform.is('cordova')) {
            this.spinnerDialog.hide();
        } else {
            this.loader.dismiss();
        }
    }

    toastShow(message) {
        if (this.platform.is('cordova')) {
            this.toast.show(message, "short", "bottom").subscribe(
                toast => {
                    //console.log(toast);
                }
            );
        } else {
            let toast = this.toastCtrl.create({
                message: message,
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
    }
}

