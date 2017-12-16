import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common-service';
import { TorrentModel } from '../models/torrent.model';
import { TvShowModel } from '../models/tvShow.model';
import 'rxjs/add/operator/map';

@Injectable()
export class TorrentService {
    private routeApi: any = 'http://192.168.1.17:8000/';
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

    search(category, title) {
        return new Promise(resolve => {
            let request: any = {
                "category": category,
                "title": title
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeSearch, param)
                .subscribe(
                    response => {
                        let elements:any = response;
                        let tvShows:any = [];
                        for (let entry of elements) {
                            let tvShow:any = new TvShowModel(
                                entry['title'],
                                entry['episodes']
                            );
                            tvShows.push(tvShow);
                        }
                        resolve(tvShows);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }


}

