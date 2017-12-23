import { Injectable } from '@angular/core';
import { App, NavController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { Toast } from '@ionic-native/toast';
import { NativeStorage } from '@ionic-native/native-storage';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {

    private loader: any = null;

    constructor(public app: App, public navCtrl: NavController, public storage: Storage, public platform: Platform,
                public loadingCtrl: LoadingController, public toastCtrl: ToastController,
                public spinnerDialog: SpinnerDialog, public toast: Toast, private nativeStorage: NativeStorage) {
        
    }

    setToken(token) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('token', token)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('token', token));
        }
    }

    getToken() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('token')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('token'));
        }
    }

    setTrackId(trackId) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('trackId', trackId)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('trackId', trackId));
        }
    }

    getTrackId() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('trackId')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('trackId'));
        }
    }

    setGranted(granted) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('granted', granted)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('granted', granted));
        }
    }

    getGranted() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('granted')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('granted'));
        }
    }

    setTokenSession(tokenSession) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('tokenSession', tokenSession)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('tokenSession', tokenSession));
        }
    }

    getTokenSession() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('tokenSession')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('tokenSession'));
        }
    }

    removeTokenSession() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.remove('tokenSession')
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.remove('tokenSession'));
        }
    }

    setFavorites(favorites) {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.setItem('favorites', favorites)
                .then(
                    () => {
                        return Promise.resolve(true);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.set('favorites', favorites));
        }
    }

    getFavorites() {
        if (this.platform.is('cordova')) {
            return this.nativeStorage.getItem('favorites')
                .then(
                    data => {
                        return Promise.resolve(data);
                    },
                    error => {
                        return Promise.resolve(false);
                    }
                );
        } else {
            return Promise.resolve(this.storage.get('favorites'));
        }
    }

    setFavorite(favorite) {
        return this.getFavorites().then(favorites => {
            let favoritesToSave:any = [];
            if (favorites) {
                favoritesToSave = favorites;
            }
            favoritesToSave.push(favorite);
            return this.setFavorites(favoritesToSave).then(setFavorites => {
                return setFavorites;
            });
        });
    }

    removeFavorite(favorite) {
        return this.getFavorites().then(favorites => {
            let favoritesToSave:any = [];
            if (favorites) {
                favoritesToSave = favorites;
                let indexToDelete:any = favoritesToSave.indexOf(favorite);
                if (indexToDelete > -1 ) {
                    favoritesToSave.splice(indexToDelete, 1);
                }
            }
            return this.setFavorites(favoritesToSave).then(setFavorites => {
                return setFavorites;
            });
        });
    }

    checkFavorite(title) {
        return this.getFavorites().then(favorites => {
            if (!favorites) {
                return false;
            }
            if (favorites.indexOf(title) >= 0) {
                return true;
            }
            return false;
        });
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

