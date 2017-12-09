import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

    constructor(public navCtrl: NavController, private commonService: CommonService) {

    }

    ionViewDidEnter () {
        this.commonService.getGranted().then(granted => {
            if (!granted) {
                this.navCtrl.setRoot(ConfigPage);
            }
        });
    }
}
