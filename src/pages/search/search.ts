import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { CommonService } from '../../providers/common-service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [TorrentService, CommonService]
})
export class SearchPage {
    private categories: any;
    private categorySelect: any = 'series';
    private torrents: any;
    private fileTransfer:FileTransferObject = null;
    private titleSearch: any = '';

  constructor(public navCtrl: NavController, private torrentService: TorrentService,
              private commonService: CommonService, private transfer: FileTransfer,
              private file: File, private localNotifications: LocalNotifications) {
  }

  ionViewDidEnter () {
      this.torrents = [];
      this.titleSearch = '';
      this.commonService.loadingShow('Please wait...');
      this.torrentService.getCategories().then(categories => {
          this.categories = categories;
          this.commonService.loadingHide();
      });
  }

  search() {
      this.commonService.loadingShow('Please wait...');
      this.torrentService.search(this.categorySelect, this.titleSearch).then(torrents => {
          this.torrents = torrents;
          this.commonService.loadingHide();
      });
  }

    download(torrent) {
        this.fileTransfer = this.transfer.create();
        let filename: any = torrent.url.replace('http://www.torrents9.pe/get_torrent/','');
        this.fileTransfer.download(torrent.url, this.file.externalRootDirectory + '/Download/' + filename).then((entry) => {
            this.localNotifications.schedule({
                id: 1,
                text: 'Le fichier téléchargé a été déposé sous '+ entry.toURL(),
                sound: null
            });
        }, (error) => {
            this.commonService.toastShow('Erreur : impossible de télécharger le fichier');
        });
    }

}
