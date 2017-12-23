import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { CommonService } from '../../providers/common-service';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [TorrentService, CommonService]
})
export class SearchPage {
    private categories: any;
    private categorySelect: any = 'series';
    private categorySerie: any = true;
    private tvShows: any = [];
    private noResult: any = false;
    private titleSearch: any = '';

  constructor(public navCtrl: NavController, private torrentService: TorrentService,
              private commonService: CommonService) {
      this.noResult = false;
      this.categorySerie = true;
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
          let limit: any = 4;
          if (this.categorySelect=='series') {
              limit = 200;
              this.categorySerie = true;
          } else {
              this.categorySerie = false;
          }
          this.torrentService.search(this.categorySelect, this.titleSearch, limit).then(tvShows => {
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
    this.navCtrl.push(NavigationDetailsSearchPage, { tvShow: tvShow });
  }

  download(torrent) {
      let filename: any = torrent.url.replace('http://www.torrents9.pe/get_torrent/','');
      this.commonService.downloadUrlFile(torrent.url, filename);
  }
}

@Component({
    templateUrl: 'tv-show.html',
    providers: [CommonService]
})
export class NavigationDetailsSearchPage {
    private tvShow:any;
    private titleIsFavorite:any = false;

    constructor(private params: NavParams, private commonService: CommonService) {
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
        let filename: any = torrent.url.replace('http://www.torrents9.pe/get_torrent/','');
        this.commonService.downloadUrlFile(torrent.url, filename);
    }
}