import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { CommonService } from '../../providers/common-service';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    selector: 'page-tv-show',
    templateUrl: 'tv-show.html',
    providers: [CommonService]
})
export class TvShowPage {
    private tvShow:any;
    private fileTransfer:FileTransferObject = null;
    private titleIsFavorite:any = false;

    constructor(private params: NavParams, private transfer: FileTransfer,
                private file: File, private localNotifications: LocalNotifications,
                private commonService: CommonService) {
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
