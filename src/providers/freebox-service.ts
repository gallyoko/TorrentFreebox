import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { CommonService } from './common-service';
import { DownloadModel } from '../models/download.model';
import 'rxjs/add/operator/map';

@Injectable()
export class FreeboxService {
    private routeApi: any = 'http://fwed.freeboxos.fr:8000/';
    //private routeApi: any = 'http://192.168.1.17:8000/';
    private appId: any = 'fr.freebox.torrent';
    private routeAuth: any;
    private routeTracking: any;
    private routeLogin: any;
    private routeLoginSession: any;
    private routeDownloads: any;
    //private routeDownload: any;
    private routeDownloadDelete: any;
    private routeDownloadStatus: any;
    private routeDownloadAddByUrl: any;

    constructor(public http: HttpClient, public commonService: CommonService) {
        //this.routeAuth = this.routeApi + 'login/authorize/';
        this.routeAuth = this.routeApi + 'freebox/authorization';
        //this.routeTracking = this.routeApi + 'login/authorize';
        this.routeTracking = this.routeApi + 'freebox/tracking/';
        //this.routeLogin = this.routeApi + 'login';
        this.routeLogin = this.routeApi + 'freebox/login';
        //this.routeLoginSession = this.routeApi + 'login/session';
        this.routeLoginSession = this.routeApi + 'freebox/login/session';
        this.routeDownloads = this.routeApi + 'freebox/downloads';
        //this.routeDownload = this.routeApi + 'freebox/download';
        this.routeDownloadDelete = this.routeApi + 'freebox/download/delete';
        this.routeDownloadStatus = this.routeApi + 'freebox/download/status';
        this.routeDownloadAddByUrl = this.routeApi + 'freebox/download/add/url';
        //this.routeDownloads = this.routeApi + 'downloads/';
        //this.routeAirMedia = this.routeApi + 'airmedia/receivers/';
    }

    auth() {
        return new Promise(resolve => {
            let request: any = {
                "app_id": this.appId,
                "app_name": "TorrentFreebox",
                "app_version": "0.0.2",
                "device_name": "Gally"
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeAuth, param)
                .subscribe(
                    response => {
                        if (response['success']) {
                            this.commonService.setToken(response['result']['app_token']).then(setToken => {
                                if (setToken) {
                                    this.commonService.setTrackId(response['result']['track_id']).then(setTrackId => {
                                        if (setTrackId) {
                                            resolve(true);
                                        } else {
                                            resolve(false);
                                        }
                                    });
                                } else {
                                    resolve(false);
                                }
                            });
                        } else {
                            resolve(false);
                        }
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    getStatus() {
        return new Promise(resolve => {
            this.commonService.getTrackId().then(trackId => {
                if (!trackId) {
                    resolve('errorTrackId');
                } else {
                    this.http.get(this.routeTracking + trackId)
                        .subscribe(
                            response => {
                                if (response['success']) {
                                    let status:any = response['result']['status'];
                                    if ( status == 'granted') {
                                        this.commonService.setGranted(true).then(granted => {
                                            if (granted) {
                                                resolve(status);
                                            } else {
                                                resolve('errorSet');
                                            }
                                        });
                                    } else {
                                        resolve(status);
                                    }
                                } else {
                                    resolve('errorCall');
                                }
                            },
                            err => {
                                resolve('errorInternal');
                            }
                        );
                }
            });


        });
    }

    challenge() {
        return new Promise(resolve => {
            let header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            const reqOpts = {
                headers: header
            };
            this.http.get(this.routeLogin, reqOpts)
                .subscribe(
                    response => {
                        if (response['success']) {
                            let challenge: any = response['result']['challenge'];
                            this.commonService.getToken().then(token => {
                                let password: any = CryptoJS.HmacSHA1(challenge, token);
                                let encPassword: any = password.toString(CryptoJS.enc.Hex);
                                this.loginSession(encPassword).then(loginSession => {
                                    resolve(loginSession);
                                });
                            });
                        } else {
                            resolve(false);
                        }
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    loginSession(password) {
        return new Promise(resolve => {
            let request: any = {
                "app_id": this.appId,
                "password": password
            };
            let param:any = JSON.stringify(request);
            let header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
            const reqOpts = {
                headers: header
            };
            this.http.post(this.routeLoginSession, param, reqOpts)
                .subscribe(
                    response => {
                        if (response['success']) {
                            this.commonService.setTokenSession(response['result']['session_token']).then(set => {
                                resolve(response['result']['session_token']);
                            });

                        } else {
                            this.commonService.removeTokenSession().then(() => {
                                resolve(false);
                            });
                        }
                    },
                    () => {
                        this.commonService.removeTokenSession().then(() => {
                            resolve(false);
                        });
                    }
                );
        });
    }

    getDownloads() {
        return new Promise(resolve => {
            this.commonService.getTokenSession().then(tokenSession => {
                if (tokenSession) {
                    this.getDownloadsGranted(tokenSession).then(downloads => {
                        if (!downloads) {
                            this.challenge().then(tokenSession => {
                                if (tokenSession) {
                                    this.getDownloadsGranted(tokenSession).then(downloads => {
                                        resolve(downloads);
                                    });
                                } else {
                                    resolve(false);
                                }
                            });
                        } else {
                            resolve(downloads);
                        }
                    });
                } else {
                    this.challenge().then(tokenSession => {
                        if (tokenSession) {
                            this.getDownloadsGranted(tokenSession).then(downloads => {
                                resolve(downloads);
                            });
                        } else {
                            resolve(false);
                        }
                    });
                }
            });

        });
    }

    getDownloadsGranted(tokenSession) {
        return new Promise(resolve => {
            let request: any = {
                "token_session": tokenSession.toString()
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeDownloads, param)
                .subscribe(
                    response => {
                        if (response['success']) {
                            let downloads:any = [];
                            if (response['result'] != undefined) {
                                for (let entry of response['result']) {
                                    let size = (entry['size'] / 1000000) + " Mo";
                                    let progress:number = Math.ceil((entry['rx_pct'] / 100));
                                    let remainingTime:any = '';
                                    let speed:any = '';
                                    let icon: string = 'play';
                                    let downloadStatus: boolean = false;
                                    let checkingStatus: boolean = false;
                                    let shareStatus: boolean = false;
                                    if (entry['rx_pct'] = 10000 || entry['status']=='seeding') {
                                        shareStatus = true;
                                        if (entry['tx_rate'] < 1000 ) {
                                            speed = entry['tx_rate'] + ' o/s';
                                        } else if (entry['tx_rate'] < 1000000 ) {
                                            speed = Math.ceil(entry['tx_rate'] / 1000) + ' Ko/s';
                                        } else {
                                            speed = Math.ceil(entry['tx_rate'] / 1000000000) + ' Mo/s';
                                        }
                                        progress = Math.ceil((entry['tx_pct'] / 100));
                                    }
                                    if (entry['status']=='downloading') {
                                        downloadStatus = true;
                                        shareStatus = false;
                                        icon = 'pause';
                                        if (entry['eta'] < 60 ) {
                                            remainingTime = entry['eta'] + ' sec';
                                        } else if (entry['eta'] < 3600 ) {
                                            remainingTime = Math.ceil(entry['eta'] / 60) + ' mn';
                                        } else if (entry['eta'] < 86400 ) {
                                            remainingTime = Math.ceil(entry['eta'] / 3600) + ' h';
                                        } else {
                                            remainingTime = Math.ceil(entry['eta'] / 86400)+ ' j';
                                        }
                                        if (entry['rx_rate'] < 1000 ) {
                                            speed = entry['rx_rate'] + ' o/s';
                                        } else if (entry['rx_rate'] < 1000000 ) {
                                            speed = Math.ceil(entry['rx_rate'] / 1000) + ' Ko/s';
                                        } else {
                                            speed = Math.ceil(entry['rx_rate'] / 1000000000) + ' Mo/s';
                                        }
                                    } else if (entry['status']=='stopped') {
                                        if (shareStatus) {
                                            icon = 'pause';
                                        } else {
                                            downloadStatus = true;
                                        }
                                    } else if (entry['status']=='checking') {
                                        if (!shareStatus) {
                                            downloadStatus = true;
                                        }
                                        checkingStatus = true;
                                    } else if (entry['status']=='starting') {
                                        if (!shareStatus) {
                                            downloadStatus = true;
                                        }
                                    } else if (entry['status']=='stopping') {
                                        if (!shareStatus) {
                                            downloadStatus = true;
                                        }
                                    } else if (entry['status']=='queued') {
                                        if (!shareStatus) {
                                            downloadStatus = true;
                                        }
                                    }
                                    let download:any = new DownloadModel(
                                        entry['id'],
                                        entry['name'],
                                        entry['size'],
                                        size,
                                        entry['queue_pos'],
                                        entry['status'],
                                        icon,
                                        entry['rx_bytes'],
                                        remainingTime,
                                        progress,
                                        speed,
                                        checkingStatus,
                                        downloadStatus,
                                        shareStatus
                                    );
                                    downloads.push(download);
                                }
                            }
                            resolve(downloads);
                        } else {
                            resolve(false);
                        }
                    },
                    err => {
                        resolve(false);
                    }
                );
        });

    }

    deleteDownload(id) {
        return new Promise(resolve => {
            this.commonService.getTokenSession().then(tokenSession => {
                if (tokenSession) {
                    this.deleteDownloadGranted(id, tokenSession).then(drop => {
                        if (!drop['success']) {
                            this.challenge().then(tokenSession => {
                                if (tokenSession) {
                                    this.deleteDownloadGranted(id, tokenSession).then(drop => {
                                        resolve(drop);
                                    });
                                } else {
                                    resolve({'success': false});
                                }
                            });
                        } else {
                            resolve(drop);
                        }
                    });
                } else {
                    this.challenge().then(tokenSession => {
                        if (tokenSession) {
                            this.deleteDownloadGranted(id, tokenSession).then(drop => {
                                resolve(drop);
                            });
                        } else {
                            resolve({'success': false});
                        }
                    });
                }
            });

        });
    }

    deleteDownloadGranted(id, tokenSession) {
        return new Promise(resolve => {
            let request: any = {
                "id": id,
                "token_session": tokenSession.toString()
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeDownloadDelete, param)
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    err => {
                        resolve({'success': false});
                    }
                );
        });
    }

    setStatusDownload(id, parameters) {
        return new Promise(resolve => {
            this.commonService.getTokenSession().then(tokenSession => {
                if (tokenSession) {
                    this.setStatusDownloadGranted(id, parameters, tokenSession).then(status => {
                        if (!status['success']) {
                            this.challenge().then(tokenSession => {
                                if (tokenSession) {
                                    this.setStatusDownloadGranted(id, parameters, tokenSession).then(status => {
                                        resolve(status);
                                    });
                                } else {
                                    resolve({'success': false});
                                }
                            });
                        } else {
                            resolve(status);
                        }
                    });
                } else {
                    this.challenge().then(tokenSession => {
                        if (tokenSession) {
                            this.setStatusDownloadGranted(id, parameters, tokenSession).then(status => {
                                resolve(status);
                            });
                        } else {
                            resolve({'success': false});
                        }
                    });
                }
            });

        });
    }

    setStatusDownloadGranted(id, parameters, tokenSession) {
        return new Promise(resolve => {
            let request: any = {
                "id": id,
                "param": parameters,
                "token_session": tokenSession.toString()
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeDownloadStatus, param)
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    err => {
                        resolve({'success': false});
                    }
                );
        });
    }

    addDownloadByUrl(url, downloadDirectory) {
        return new Promise(resolve => {
            this.commonService.getTokenSession().then(tokenSession => {
                if (tokenSession) {
                    this.addDownloadByUrlGranted(url, downloadDirectory, tokenSession).then(add => {
                        if (!add['success']) {
                            this.challenge().then(tokenSession => {
                                if (tokenSession) {
                                    this.addDownloadByUrlGranted(url, downloadDirectory, tokenSession).then(add => {
                                        resolve(add);
                                    });
                                } else {
                                    resolve({'success': false});
                                }
                            });
                        } else {
                            resolve(add);
                        }
                    });
                } else {
                    this.challenge().then(tokenSession => {
                        if (tokenSession) {
                            this.addDownloadByUrlGranted(url, downloadDirectory, tokenSession).then(add => {
                                resolve(add);
                            });
                        } else {
                            resolve({'success': false});
                        }
                    });
                }
            });

        });
    }

    addDownloadByUrlGranted(url, downloadDirectory, tokenSession) {
        return new Promise(resolve => {
            let request: any = {
                "token_session": tokenSession.toString(),
                "param" : {
                    "download_url": url,
                    "download_dir": downloadDirectory
                }
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeDownloadAddByUrl, param)
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    err => {
                        resolve({'success': false});
                    }
                );
        });
    }

}

