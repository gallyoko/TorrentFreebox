import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ISubscription } from 'rxjs/Subscription';
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

  private authMessage:string;
  private subscriptionTimer:ISubscription;

  constructor(private navCtrl: NavController, public commonService: CommonService,
              public freeboxService: FreeboxService) {
      this.authMessage = "";
  }

  authentification () {
      this.authMessage = "";
      this.commonService.loadingShow("Demande en cours...");
      this.freeboxService.auth().then(auth => {
          this.commonService.loadingHide();
          if (auth) {
              this.commonService.loadingShow("Veuillez autoriser l'application depuis la Freebox");
              this.subscriptionTimer = Observable.interval(1500).subscribe(x => {
                  this.checkStatus();
              });
          } else {
              this.authMessage = "Erreur d'authentification.";
          }
      });
  }

  ionViewDidLeave () {
      this.subscriptionTimer.unsubscribe ();
  }

  checkStatus () {
      this.freeboxService.getStatus().then(status => {
          if (status=='granted') {
              this.commonService.toastShow("Autorisation effectuée.");
              this.commonService.loadingHide();
              this.subscriptionTimer.unsubscribe ();
              this.navCtrl.setRoot(TabsPage);
          } else if (status!='pending') {
              this.subscriptionTimer.unsubscribe ();
              this.commonService.loadingHide();
              this.commonService.toastShow("Erreur d'autorisation.");
          }
      });
  }
}
