import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { CommonService } from '../../providers/common-service';

@Component({
    selector: 'page-favorite',
    templateUrl: 'favorite.html',
    providers: [CommonService]
})
export class FavoritePage {
    private noFavorite:any = false;
    private favorites:any = [];

    constructor(public navCtrl: NavController, private commonService: CommonService,
                private actionsheetCtrl: ActionSheetController, private alertCtrl: AlertController) {

    }

    ionViewDidEnter () {
        this.noFavorite = false;
        this.showFavorites();
    }

    showFavorites() {
        this.favorites = [];
        this.commonService.getFavorites().then(favorites => {
            if (favorites) {
                this.favorites = favorites;
                if (this.favorites.length == 0 ) {
                    this.noFavorite = true;
                }
            }
        });
    }

    openMenu(title) {
        let actionSheet = this.actionsheetCtrl.create({
            title: title,
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Episodes',
                    icon: 'md-information-circle',
                    handler: () => {
                        this.openNavDetailsPage(title);
                    }
                },
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.showConfirmDelete(title);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: 'close',
                    handler: () => {
                        //console.log('Cancel clicked  ' + favorite.id);
                    }
                }
            ]
        });
        actionSheet.present();
    }

    openNavDetailsPage(title) {
        this.navCtrl.push(NavigationDetailsFavoritePage, { title: title });
    }

    showConfirmDelete(title) {
        let confirm = this.alertCtrl.create({
            title: 'Suppression',
            message: 'Confirmez-vous la suppression de "'+title+'" des favoris ?',
            buttons: [
                {
                    text: 'Oui',
                    handler: () => {
                        this.remove(title);
                    }
                },
                {
                    text: 'Non',
                    handler: () => {
                        //console.log('Non');
                    }
                }
            ]
        });
        confirm.present();
    }

    remove(title) {
        this.commonService.removeFavorite(title).then(remove => {
            if (remove) {
                this.showFavorites();
            }
        });
    }
}

@Component({
    templateUrl: 'tv-show.html',
    providers: [CommonService, TorrentService]
})
export class NavigationDetailsFavoritePage {
    private title:any = '';
    private tvShow:any = [];

    constructor(private params: NavParams, private commonService: CommonService,
                private torrentService: TorrentService) {
        this.title = this.params.data.title;
        this.getTvShow();
    }

    getTvShow() {
        this.commonService.loadingShow('Please wait...');
        let limit: any = 200;
        this.torrentService.search('series', this.title, limit).then(tvShows => {
            this.tvShow = tvShows[0];
            this.commonService.loadingHide();
        });
    }

    download(torrent) {
        let filename: any = torrent.url.replace('http://www.torrents9.pe/get_torrent/','');
        this.commonService.downloadUrlFile(torrent.url, filename);
    }
}
