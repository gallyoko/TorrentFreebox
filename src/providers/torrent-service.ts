import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TorrentService {
    private routeAuth: any = 'http://mafreebox.freebox.fr/api/v4/login/authorize/';

    constructor(public http: Http) {
        
    }

    auth() {
        return new Promise(resolve => {
            let request: any = {
                "app_id": "fr.freebox.testapp",
                "app_name": "TorrentFreebox",
                "app_version": "1.0",
                "device_name": "Gally"
            };
            let param:any = JSON.stringify(request);
            this.http.post(this.routeAuth, param)
                .map(res => res.json())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    err => {
                        resolve(err);
                    }
                );
        });
    }


}

