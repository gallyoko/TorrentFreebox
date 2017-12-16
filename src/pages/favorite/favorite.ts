import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { CommonService } from '../../providers/common-service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    templateUrl: 'tv-show.html',
    providers: [CommonService, TorrentService]
})
export class NavigationDetailsFavoritePage {
    private tvShow:any = [];
    private fileTransfer:FileTransferObject = null;

    constructor(private params: NavParams, private transfer: FileTransfer,
                private file: File, private localNotifications: LocalNotifications,
                private commonService: CommonService, private torrentService: TorrentService) {
        this.getTvShow(params.data.title);
    }

    getTvShow(title) {
        this.commonService.loadingShow('Please wait...');
        this.torrentService.search('series', title).then(tvShows => {
            this.tvShow = tvShows[0];
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

@Component({
  selector: 'page-favorite',
  templateUrl: 'favorite.html',
    providers: [CommonService]
})
export class FavoritePage {
    private favorites:any = [];

    constructor(public navCtrl: NavController, private commonService: CommonService) {

    }

    ionViewDidEnter () {
        this.showFavorites();
    }

    showFavorites() {
        this.favorites = [];
        this.commonService.getFavorites().then(favorites => {
            if (favorites) {
                this.favorites = favorites;
            }
        });
    }

    openNavDetailsPage(title) {
        this.navCtrl.push(NavigationDetailsFavoritePage, { title: title });
    }
}
