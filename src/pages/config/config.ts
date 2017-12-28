import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FreeboxService } from '../../providers/freebox-service';
import { CommonService } from '../../providers/common-service';
import { NewzService } from '../../providers/newz-service';
import { DatabaseService } from '../../providers/database-service';

@Component({
    selector: 'page-config',
    templateUrl: 'config.html',
    providers: [CommonService, FreeboxService]
})
export class ConfigPage {
    private downloadDirectory: any;
    private nbDownload: any;
    private server: any;
    private port: any;
    private username: any;
    private password: any;
    private nbConnexion: any;
    private autoRepair: any;
    private autoExtract: any;

    constructor(private commonService: CommonService, private freeboxService: FreeboxService,
                public navCtrl: NavController) {}

    ionViewDidEnter () {
        this.downloadDirectory = '';
        this.nbDownload = '2';
        this.server = '';
        this.port = '119';
        this.username = '';
        this.password = '';
        this.nbConnexion = '10';
        this.autoRepair = false;
        this.autoExtract = false;
        this.commonService.getGranted().then(granted => {
            if (granted) {
                this.commonService.loadingShow('Please wait...');
                this.freeboxService.getDownloadConfig().then(config => {
                    if (config['success']) {
                        this.setField(config['result']);
                    }
                    this.commonService.loadingHide();
                });
            }
        });
    }

    setField(data) {
        this.downloadDirectory = data['download_dir'];
        this.nbDownload = data['max_downloading_tasks'];
        this.server = data['news']['server'];
        this.port = data['news']['port'];
        this.username = data['news']['user'];
        this.password = data['news']['password'];
        this.nbConnexion = data['news']['nthreads'];
        this.autoRepair = data['news']['auto_repair'];
        this.autoExtract = data['news']['auto_extract'];
    }

    save() {
        this.commonService.getGranted().then(granted => {
            if (granted) {
                this.commonService.loadingShow('Please wait...');
                const parameters = {
                    "max_downloading_tasks": this.nbDownload,
                    "download_dir": this.downloadDirectory,
                    "news": {
                        "user": this.username,
                        "port": this.port,
                        "nthreads": this.nbConnexion,
                        "auto_repair": this.autoRepair,
                        "auto_extract": this.autoExtract,
                        "server": this.server
                    }
                };
                this.freeboxService.updateDownloadConfig(parameters).then(update => {
                    if (update['success']) {
                        this.setField(update['result']);
                    }
                    this.commonService.loadingHide();
                });
            }
        });
    }

    openNavNewzPage() {
        this.navCtrl.push(NavigationNewsPage, {});
    }
}

@Component({
    templateUrl: 'newz.html',
    providers: [CommonService, NewzService, DatabaseService]
})
export class NavigationNewsPage {
    private categories: any = [];
    private categorySelect: any;
    private resultShow: any = false;
    private resultUpdate: any = '';
    private resultFullCategory: any = '';
    private resultFull: any = '';
    private countBefore: number = 0;

    constructor(private commonService: CommonService, private newzService: NewzService,
                private databaseService: DatabaseService) {}

    ionViewDidEnter () {
        this.categories = [];
        /*this.commonService.removeBddCreate().then(() => {

        });*/
        this.checkBdd().then(checkBdd => {
            if (checkBdd) {
                this.databaseService.getCategories().then(categories => {
                    this.categories = categories;
                });
            } else {
                this.commonService.toastShow('Erreur de base de données.');
            }
        });
    }

    checkBdd() {
        return new Promise(resolve => {
            this.commonService.loadingShow('Please wait...');
            resolve(this.commonService.getBddCreate().then(bddCreate => {
                if (bddCreate) {
                    return this.databaseService.openBdd().then(openBdd => {
                        this.commonService.loadingHide();
                        return openBdd;
                    });
                } else {
                    return this.databaseService.createBdd().then(bddCreate => {
                        return this.commonService.setBddCreate(bddCreate).then(setbddCreate => {
                            this.commonService.loadingHide();
                            return setbddCreate;
                        });
                    });
                }
            }));
        });
    }

    search() {
        if (this.categorySelect) {
            this.resultShow = false;
            this.resultUpdate = '';
            this.resultFullCategory = '';
            this.resultFull = '';
            this.commonService.loadingShow('Please wait...');
            this.databaseService.getSubCategoriesFromCategory(this.categorySelect).then(dataset => {
                if (dataset) {
                    this.databaseService.getBinariesByCategory(this.categorySelect).then(binaries => {
                        let binariesCategory: any = binaries;
                        this.countBefore = binariesCategory.length;
                        this.newzService.getLastRelease(dataset).then(release => {
                            let result: any = release;
                            for(let i = 0; i < result.length; i++) {
                                let newzSubcategory: any = result[i];
                                for(let j = 0; j < newzSubcategory['newz']['items'].length; j++) {
                                    let content: any = newzSubcategory['newz']['items'][j].content;
                                    let elements: any = content.split('<br>');
                                    let langue: any = '';
                                    let newsgroup: any = '';
                                    let filename: any = '';
                                    let resolution: any = '';
                                    let size: any = '';
                                    for(let k = 0; k < elements.length; k++) {
                                        if (elements[k].indexOf('Langue :') > -1 ) {
                                            langue = elements[k].replace('Langue :', '');
                                        } else if (elements[k].indexOf('Newsgroup :') > -1 ) {
                                            newsgroup = elements[k].replace('Newsgroup :', '');
                                        } else if (elements[k].indexOf('Nom du fichier :') > -1 ) {
                                            filename = elements[k].replace('Nom du fichier :', '');
                                        } else if (elements[k].indexOf('Résolution :') > -1 ) {
                                            resolution = elements[k].replace('Résolution :', '');
                                        } else if (elements[k].indexOf('Résolution HD :') > -1 ) {
                                            resolution = elements[k].replace('Résolution HD :', '');
                                        } else if (elements[k].indexOf('Taille :') > -1 ) {
                                            size = elements[k].replace('Taille :', '');
                                        }
                                    }
                                    this.databaseService.insertTableBinary(newzSubcategory.subcategoryId,
                                        newzSubcategory['newz']['items'][j].title,
                                        newzSubcategory['newz']['items'][j].link,
                                        new Date (newzSubcategory['newz']['items'][j].pubDate),
                                        size.trim(),
                                        langue.trim(),
                                        resolution.trim(),
                                        newsgroup.trim(),
                                        filename.trim()
                                    ).then(() => {
                                        if ((j + 1) >= newzSubcategory['newz']['items'].length) {
                                            this.showResult();
                                        }
                                    });
                                }
                            }
                        });
                    });
                }
            });
        } else {
            this.commonService.toastShow('Veuillez sélectionner une catégorie.');
        }
    }

    showResult() {
        this.databaseService.getBinaries().then((binaries) => {
            let allBinaries: any = binaries;
            this.databaseService.getBinariesByCategory(this.categorySelect).then((binariesByCategory) => {
                let allBinariesByCategory: any = binariesByCategory;
                this.resultUpdate = (allBinariesByCategory.length - this.countBefore) + ' éléments ajoutés';
                this.resultFullCategory = allBinariesByCategory.length + ' éléments recensés dans cette catégorie.';
                this.resultFull = allBinaries.length + ' éléments recensés toutes catégories confondues.';
                this.resultShow = true;
                this.commonService.loadingHide();
            });
        });
    }

}