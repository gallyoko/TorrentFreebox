import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FreeboxService } from '../../providers/freebox-service';
import { CommonService } from '../../providers/common-service';

@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
  providers: [FreeboxService, CommonService]
})
export class FavoritePage {

    constructor(public navCtrl: NavController, private freeboxService: FreeboxService,
                private commonService: CommonService) {

    }

    ionViewDidEnter () {

    }

    ionViewDidLeave () {

    }
}
