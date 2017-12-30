import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TorrentService } from '../../providers/torrent-service';
import { NzbService } from '../../providers/nzb-service';
import { DatabaseService } from '../../providers/database-service';
import { FreeboxService } from '../../providers/freebox-service';
import { CommonService } from '../../providers/common-service';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [TorrentService, CommonService, DatabaseService]
})
export class SearchPage {
    private categories: any;
    private categorySelect: any = 'series';
    private categorySerie: any = true;
    private tvShows: any = [];
    private noResult: any = false;
    private titleSearch: any = '';
    private torrentMode: any = true;

  constructor(public navCtrl: NavController, private torrentService: TorrentService,
              private commonService: CommonService, private databaseService: DatabaseService) {
      this.noResult = false;
      this.categorySerie = true;
      this.torrentMode = true;
  }

  ionViewDidEnter () {
      this.commonService.loadingShow('Please wait...');
      this.loadCategories();
  }

  onChangeMode() {
      this.commonService.loadingShow('Please wait...');
      this.tvShows = [];
      if (this.torrentMode) {
          this.loadCategories();
      } else {
          this.commonService.getBddCreate().then(bddCreate => {
              if (bddCreate) {
                  this.databaseService.openBdd().then(() => {
                      this.loadCategories();
                  });
              }
          });
      }
  }

  loadCategories() {
      if (this.torrentMode) {
          this.torrentService.getCategories().then(categories => {
              this.categories = categories;
              this.commonService.loadingHide();
          });
      } else {
          this.databaseService.getCategories().then(categories => {
              this.categories = categories;
              this.commonService.loadingHide();
          });
      }
  }

  search() {
      if (this.torrentMode) {
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
                  console.log('tvShows => ');
                  console.log(tvShows);
                  this.tvShows = tvShows;
                  if (this.tvShows.length == 0) {
                      this.noResult = true;
                  }
                  this.commonService.loadingHide();
              });
          } else {
              this.commonService.toastShow('Veuillez saisir votre recherche.');
          }
      } else {
          if (this.categorySelect) {
              this.tvShows = [];
              this.noResult = false;
              this.commonService.loadingShow('Please wait...');
              this.databaseService.getBinariesByCategory(this.categorySelect).then(dataset => {
                  if (dataset) {
                      this.tvShows = dataset;
                      if (this.tvShows.length == 0) {
                          this.noResult = true;
                      }
                      this.commonService.loadingHide();
                  }
              });
          } else {
              this.commonService.toastShow('Veuillez sélectionner une catégorie.');
          }
      }
  }

  openNavDetailsPage(tvShow) {
    this.navCtrl.push(NavigationDetailsSearchPage, { tvShow: tvShow });
  }

  openNavDetailsNewzPage(tvShow) {
    this.navCtrl.push(NavigationDetailsNewzPage, { tvShow: tvShow });
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

@Component({
    templateUrl: 'newz.html',
    providers: [CommonService, NzbService, FreeboxService]
})
export class NavigationDetailsNewzPage {
    private tvShow:any;
    private noResult:any;
    private result:any;

    constructor(private params: NavParams, private commonService: CommonService,
                private nzbService: NzbService, private freeboxService: FreeboxService) {
        this.tvShow = this.params.data.tvShow;
        this.result = [];
        this.noResult = false;
    }

    checkNzb () {
        this.commonService.loadingShow('Please wait...');
        this.result = [];
        this.noResult = false;
        this.nzbService.getNzbs(this.tvShow.filename).then(nzb => {
            if (nzb) {
                let nzbs: any = nzb;
                if (nzbs.length > 0) {
                    this.result = nzbs;
                } else {
                    this.noResult = true;
                }
            } else {
                this.commonService.toastShow("Erreur : impossible de récupérer les NZBs.");
            }
            this.commonService.loadingHide();
        });
    }

    download (nzb) {
        this.commonService.loadingShow('Please wait...');
        this.freeboxService.addDownloadByUrl(nzb.url, 'L0Rpc3F1ZSBkdXIvVMOpbMOpY2hhcmdlbWVudHMv').then(response => {
            if (response) {
                let data: any = response;
                if (data.success) {
                    this.commonService.toastShow("Le téléchargement a été ajouté..");
                } else {
                    console.log(JSON.stringify(data));
                    this.commonService.toastShow("Erreur : impossible d'ajouter le NZB à la freebox.");
                }
            } else {
                this.commonService.toastShow("Erreur interne : impossible d'ajouter le NZB à la freebox.");
            }
            this.commonService.loadingHide();
        });
    }
}