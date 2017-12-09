import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FreeboxService } from '../../providers/freebox-service';

@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
  providers: [FreeboxService]
})
export class SharePage {

  constructor(public navCtrl: NavController, private freeboxService: FreeboxService) {

  }

  download() {
      let url = 'http%3A%2F%2Fwww.torrents9.pe%2Fget_torrent%2Fvikings-s05e03-vostfr-bluray-720p-hdtv.torrent';
      let downloadDirectory = 'L0Rpc3F1ZSBkdXIvVMOpbMOpY2hhcmdlbWVudHMv';
      this.freeboxService.addDownloadByUrl(url, downloadDirectory).then(add => {
          if (add) {
              console.log('yesss');
          } else {
              console.log('noooo');
          }
      });
  }
}
