import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ProgressBarComponent } from '../directives/progress-bar/progress-bar';

import { ConfigPage } from '../pages/config/config';
import { FavoritePage, NavigationDetailsFavoritePage } from '../pages/favorite/favorite';
import { SearchPage, NavigationDetailsPage } from '../pages/search/search';
import { DownloadPage } from '../pages/download/download';
import { TabsPage } from '../pages/tabs/tabs';

import { Toast } from '@ionic-native/toast';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';

@NgModule({
  declarations: [
      MyApp,
      ProgressBarComponent,
      ConfigPage,
      FavoritePage,
      NavigationDetailsFavoritePage,
      SearchPage,
      NavigationDetailsPage,
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
      FavoritePage,
      NavigationDetailsFavoritePage,
      SearchPage,
      NavigationDetailsPage,
      DownloadPage,
      TabsPage
  ],
  providers: [
      StatusBar,
      SplashScreen,
      Toast,
      SpinnerDialog,
      File,
      FileTransfer,
      FileTransferObject,
      LocalNotifications,
      FileOpener,
      {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
