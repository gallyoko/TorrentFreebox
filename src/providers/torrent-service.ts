import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import TorrentSearchApi from 'torrent-search-api';
import { CommonService } from './common-service';
import 'rxjs/add/operator/map';

@Injectable()
export class TorrentService {
    private routeAuth: any = 'http://mafreebox.freebox.fr/api/v4/login/authorize/';

    constructor(public http: HttpClient, public commonService: CommonService) {
        
    }

    search() {
        const torrentSearch = new TorrentSearchApi();
        console.log(torrentSearch.getProviders());
        torrentSearch.enableProvider('Torrent9');

        // Search '1080' in 'Movies' category and limit to 20 results
        torrentSearch.search('1080', 'Movies', 20)
            .then(torrents => {
                console.log(torrents);
            })
            .catch(err => {
                console.log(err);
            });
    }


}

