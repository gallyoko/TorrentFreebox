import { Component } from '@angular/core';
import { FreeboxService } from '../../providers/freebox-service';
import { CommonService } from '../../providers/common-service';

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

    constructor(public commonService: CommonService, public freeboxService: FreeboxService) {    }

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
}
