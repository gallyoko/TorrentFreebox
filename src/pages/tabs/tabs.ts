import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NavController, Platform } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { ConfigPage } from '../config/config';

import { FavoritePage } from '../favorite/favorite';
import { SearchPage } from '../search/search';
import { DownloadPage } from '../download/download';

@Component({
    templateUrl: 'tabs.html',
    providers: [CommonService]
})
export class TabsPage {

    tab1Root = DownloadPage;
    tab2Root = FavoritePage;
    tab3Root = SearchPage;

    constructor(public navCtrl: NavController, private platform: Platform,
                private statusBar: StatusBar, private splashScreen: SplashScreen,
                private commonService: CommonService) {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.commonService.getGranted().then(granted => {
                if (!granted) {
                    this.navCtrl.setRoot(ConfigPage);
                }
            });
        });
    }
}
