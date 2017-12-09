import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FreeboxService } from '../../providers/freebox-service';
import { CommonService } from '../../providers/common-service';
import { TabsPage } from '../tabs/tabs';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'page-config',
    templateUrl: 'config.html',
    providers: [CommonService, FreeboxService]
})
export class ConfigPage {

  private authMessage:any = "";
  private subscription:any = 0;

  constructor(private navCtrl: NavController, public commonService: CommonService,
              public freeboxService: FreeboxService) {
  }

  authentification () {
      this.authMessage = "";
      this.commonService.loadingShow("Demande en cours...");
      this.freeboxService.auth().then(auth => {
          this.commonService.loadingHide();
          if (auth) {
              this.commonService.loadingShow("Veuillez autoriser l'application depuis la Freebox");
              this.subscription = Observable.interval(1500).subscribe(x => {
                  this.checkStatus();
              });
          } else {
              this.authMessage = "Erreur d'authentification.";
          }
      });
  }

  checkStatus () {
      this.freeboxService.getStatus().then(status => {
          if (status=='granted') {
              this.commonService.toastShow("Autorisation effectuée.");
              this.commonService.loadingHide();
              this.subscription.unsubscribe ();
              this.navCtrl.setRoot(TabsPage);
          } else if (status!='pending') {
              this.subscription.unsubscribe ();
              this.commonService.loadingHide();
              this.commonService.toastShow("Erreur d'autorisation.");
          }
      });
  }
}
