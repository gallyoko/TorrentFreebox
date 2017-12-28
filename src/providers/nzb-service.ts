import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common-service';
import { NzbModel } from '../models/nzb.model';
import 'rxjs/add/operator/map';

@Injectable()
export class NzbService {
    private routeApiRss2Json: any = 'https://api.rss2json.com/v1/api.json?rss_url=';
    private routeApiRssNzb: any = 'http://www.nzbindex.nl/rss/?q=';

    constructor(public http: HttpClient, public commonService: CommonService) {}

    getNzbs(filename) {
        return new Promise(resolve => {
            this.http.get(this.routeApiRss2Json + this.routeApiRssNzb + filename)
                .subscribe(
                    response => {
                        if (response['status'] == 'ok') {
                            let nzbs: any = response['items'];
                            let nzbReturn: any = [];
                            if (nzbs.length > 0) {
                                for(let i = 0; i < nzbs.length; i++) {
                                    let elements: any = nzbs[i].description.split('<br>');
                                    let sizeFile: any = '';
                                    let sizeElement: any = elements[1].replace(/<b>|<\/b>/gi,'');
                                    let url: any = nzbs[i].link.replace('/release/', '/download/');
                                    let nzbModel = new NzbModel(
                                        nzbs[i].title,
                                        sizeFile,
                                        sizeElement.trim(),
                                        url,
                                        new Date(nzbs[i].pubDate)
                                    );
                                    nzbReturn.push(nzbModel);
                                }
                            }
                            resolve(nzbReturn);
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
}

