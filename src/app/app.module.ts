import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ProgressBarComponent } from '../directives/progress-bar/progress-bar';

import { ConfigPage } from '../pages/config/config';
import { SharePage } from '../pages/share/share';
import { SearchPage } from '../pages/search/search';
import { DownloadPage } from '../pages/download/download';
import { TabsPage } from '../pages/tabs/tabs';

import { Toast } from '@ionic-native/toast';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
      MyApp,
      ProgressBarComponent,
      ConfigPage,
      SharePage,
      SearchPage,
      DownloadPage,
      TabsPage,
  ],
  imports: [
      BrowserModule,
      HttpClientModule,
      IonicModule.forRoot(MyApp),
      IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
      MyApp,
      ConfigPage,
      SharePage,
      SearchPage,
      DownloadPage,
      TabsPage
  ],
  providers: [
      StatusBar,
      SplashScreen,
      Toast,
      SpinnerDialog,
      {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
