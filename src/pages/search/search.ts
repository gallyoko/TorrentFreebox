import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { CommonService } from '../../providers/common-service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [TorrentService, CommonService]
})
export class SearchPage {
    private categories: any;
    private categorySelect: any = 'series';
    private tvShows: any = [];
    private noResult: any = false;
    private titleSearch: any = '';

  constructor(public navCtrl: NavController, private torrentService: TorrentService,
              private commonService: CommonService) {
      this.noResult = false;
  }

  ionViewDidEnter () {
      this.commonService.loadingShow('Please wait...');
      this.torrentService.getCategories().then(categories => {
          this.categories = categories;
          this.commonService.loadingHide();
      });
  }

  search() {
      if (this.titleSearch.trim() != '') {
          this.tvShows = [];
          this.noResult = false;
          this.commonService.loadingShow('Please wait...');
          this.torrentService.search(this.categorySelect, this.titleSearch).then(tvShows => {
              this.tvShows = tvShows;
              if (this.tvShows.length == 0) {
                this.noResult = true;
              }
              this.commonService.loadingHide();
          });
      } else {
          this.commonService.toastShow('Veuillez saisir votre recherche.');
      }
  }

  openNavDetailsPage(tvShow) {
    this.navCtrl.push(NavigationDetailsPage, { tvShow: tvShow });
  }

}

@Component({
    templateUrl: 'tv-show.html',
    providers: [CommonService]
})
export class NavigationDetailsPage {
    private tvShow:any;
    private fileTransfer:FileTransferObject = null;
    private titleIsFavorite:any = false;

    constructor(private params: NavParams, private transfer: FileTransfer,
                private file: File, private localNotifications: LocalNotifications,
                private fileOpener: FileOpener, private commonService: CommonService) {
        this.tvShow = this.params.data.tvShow;
        this.checkTitle();
    }

    checkTitle() {
        this.titleIsFavorite = false;
        this.commonService.checkFavorite(this.tvShow.title).then(exist => {
            this.titleIsFavorite = exist;
        });
    }

    addToFavorite() {
        this.commonService.setFavorite(this.tvShow.title).then(setFavorite => {
            if (setFavorite) {
                this.titleIsFavorite = true;
                this.commonService.toastShow('Le titre a été ajouté aux favoris.');
            } else {
                this.commonService.toastShow("Erreur : impossible d'ajouter le titre aux favoris.");
            }
        });
    }

    download(torrent) {
        this.fileTransfer = this.transfer.create();
        let filename: any = torrent.url.replace('http://www.torrents9.pe/get_torrent/','');
        this.fileTransfer.download(torrent.url, this.file.externalDataDirectory + filename).then((entry) => {
            this.localNotifications.schedule({
                id: 1,
                text: 'Le fichier téléchargé a été déposé sous '+ entry.toURL(),
                sound: null,
                led: 'FF0000'
            });
            this.localNotifications.on('click', (event, notification, state) => {
                this.openPathTransfertFile(this.file.externalDataDirectory, filename);
            });
        }, (error) => {
            this.commonService.toastShow('Erreur : impossible de télécharger le fichier');
        });
    }

    openPathTransfertFile(path, filename) {
        this.fileOpener.open(path + filename, 'application/torrent')
            .then(() => this.commonService.toastShow('Success : ouvrir ' + filename + ' depuis le dossier ' + path))
            .catch(e => this.commonService.toastShow('Erreur : impossible d\'ouvrir ' + filename + ' depuis le dossier ' + path));
    }
}