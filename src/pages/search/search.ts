import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { CommonService } from '../../providers/common-service';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [TorrentService, CommonService]
})
export class SearchPage {

  constructor(public navCtrl: NavController, private torrentService: TorrentService,
              private commonService: CommonService) {

  }

  ionViewDidEnter () {

      this.torrentService.search()
  }

}
