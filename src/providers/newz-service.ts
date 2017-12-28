import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common-service';
import 'rxjs/add/operator/map';

@Injectable()
export class NewzService {
    private routeApiRss2Json: any = 'https://api.rss2json.com/v1/api.json?rss_url=';

    constructor(public http: HttpClient, public commonService: CommonService) {}

    getLastRelease(subCategories) {
        return new Promise(resolve => {
            const releases: any = [];
            if(subCategories.length > 0) {
                for(let i = 0; i < subCategories.length; i++) {
                    this.getRelease(subCategories[i]).then(release => {
                        releases.push(release);
                        let checkFor: number = i + 1;
                        if (checkFor >= subCategories.length) {
                            resolve(releases);
                        }
                    });
                }
            } else {
                resolve(releases);
            }
        });
    }

    getRelease(subCategory) {
        return new Promise(resolve => {
            this.http.get(this.routeApiRss2Json + subCategory.rss)
                .subscribe(
                    response => {
                        let line: any = {
                            "subcategoryId": subCategory.id,
                            "subcategoryName": subCategory.name,
                            "newz": response
                        };
                        resolve(line);
                    },
                    err => {
                        resolve(false);
                    }
                );
        });
    }

    getReleaseTest() {
        return new Promise(resolve => {
            this.http.get(this.routeApiRss2Json + 'http://www.binnews.in/new_rss/cat-44.html')
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
}

