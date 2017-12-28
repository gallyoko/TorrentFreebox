import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { ProgressBarComponent } from '../directives/progress-bar/progress-bar';

import { AuthenticationPage } from '../pages/authentication/authentication';
import { ConfigPage, NavigationNewsPage } from '../pages/config/config';
import { FavoritePage, NavigationDetailsFavoritePage } from '../pages/favorite/favorite';
import { SearchPage, NavigationDetailsSearchPage } from '../pages/search/search';
import { DownloadPage } from '../pages/download/download';
import { TabsPage } from '../pages/tabs/tabs';

import { CommonService } from '../providers/common-service';
import { FreeboxService } from '../providers/freebox-service';
import { TorrentService } from '../providers/torrent-service';
import { NewzService } from '../providers/newz-service';
import { DatabaseService } from '../providers/database-service';

import { Toast } from '@ionic-native/toast';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { FileOpener } from '@ionic-native/file-opener';
import { NativeStorage } from '@ionic-native/native-storage';
import { SQLite } from '@ionic-native/sqlite';

@NgModule({
  declarations: [
      MyApp,
      ProgressBarComponent,
      AuthenticationPage,
      ConfigPage,
      NavigationNewsPage,
      FavoritePage,
      NavigationDetailsFavoritePage,
      SearchPage,
      NavigationDetailsSearchPage,
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
      AuthenticationPage,
      ConfigPage,
      NavigationNewsPage,
      FavoritePage,
      NavigationDetailsFavoritePage,
      SearchPage,
      NavigationDetailsSearchPage,
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
      NativeStorage,
      SQLite,
      CommonService,
      FreeboxService,
      TorrentService,
      NewzService,
      DatabaseService,
      {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
