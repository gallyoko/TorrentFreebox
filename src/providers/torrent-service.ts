import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common-service';
import { TvShowModel } from '../models/tvShow.model';
import { TorrentModel } from '../models/torrent.model';
import 'rxjs/add/operator/map';

@Injectable()
export class TorrentService {
    private routeApi: any = 'http://fwed.freeboxos.fr:8000/';
    //private routeApi: any = 'http://192.168.1.17:8000/';
    private routeCategories: any;
    private routeSearch: any;

    constructor(public http: HttpClient, public commonService: CommonService) {
        this.routeCategories = this.routeApi + 'torrent/categories';
        this.routeSearch = this.routeApi + 'torrent/search';
    }

    getCategories() {
        return new Promise(resolve => {
            this.http.get(this.routeCategories)
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    search(category, title, limit) {
        return new Promise(resolve => {
            let request: any = {
                "category": category,
                "title": title,
                "limit": limit
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeSearch, param)
                .subscribe(
                    response => {
                        let elements:any = response;
                        let torrents:any = [];
                        if (category=='series') {
                            for (let entry of elements) {
                                let tvShow:any = new TvShowModel(
                                    entry['title'],
                                    entry['episodes']
                                );
                                torrents.push(tvShow);
                            }
                        } else {
                            for (let entry of elements) {
                                let torrent:any = new TorrentModel(
                                    entry['title'],
                                    entry['size'],
                                    entry['url'],
                                    entry['seed']
                                );
                                torrents.push(torrent);
                            }
                        }
                        resolve(torrents);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }


}

