import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { MyApp } from './app.component';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { GlobalVars } from '../providers/globalVars';
import { StorageServices } from '../providers/storageServices';
import { SearchService } from '../providers/searchService';
import { SettingsService } from '../providers/settingsService';
import { Zip } from '@ionic-native/zip';

import { SafePipe } from '../pipes/safePipe';
import { ImagePipe } from '../pipes/imagePipe';
import { OrderByPipe } from '../pipes/orderByPipe';

import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { BookPage } from '../pages/book/book';
import { VolumePage } from '../pages/volume/volume';
import { ArticlePage } from '../pages/article/article';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { SearchPage } from '../pages/search/search';
import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';
import { TocPage } from '../pages/toc/toc';
import { ToolbarSettingsPage } from '../pages/toolbar-settings/toolbar-settings';

@NgModule({
  declarations: [
    SafePipe,
    ImagePipe,
    OrderByPipe,
    MyApp,
    HomePage,
    CategoryPage,
    BookPage,
    VolumePage,
    ArticlePage,
    BookmarksPage,
    SearchPage,
    HistoryPage,
    SettingsPage,
    AboutPage,
    TocPage,
    ToolbarSettingsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb', driverOrder: ['LocalStorage', 'sqlite', 'indexeddb', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CategoryPage,
    BookPage,
    VolumePage,
    ArticlePage,
    BookmarksPage,
    SearchPage,
    HistoryPage,
    SettingsPage,
    AboutPage,
    TocPage,
    ToolbarSettingsPage
  ],
  providers: [
    Zip,
    GoogleAnalytics,
    GlobalVars,
    StatusBar,
    SplashScreen,
    StorageServices,
    SearchService,
    SettingsService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
