import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ViewController, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { GlobalVars } from '../providers/globalVars';
import { SettingsService } from '../providers/settingsService';
import { StorageServices } from '../providers/storageServices';

import { HomePage } from '../pages/home/home';
import { CategoryPage } from '../pages/category/category';
import { BookmarksPage } from '../pages/bookmarks/bookmarks';
import { SearchPage } from '../pages/search/search';
import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private imageUrlPrefix:string;

  rootPage: any = HomePage;

  selectedMode: String;
  selectedFontSize: String;
  
  pages: Array<{title: string, component: any, icon:string}>;

  constructor(public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public globalVars: GlobalVars,
    private settingsService: SettingsService,
    private storageServices: StorageServices,
    public app: App,
    private ga: GoogleAnalytics
  ) {

    if(platform.is("android")){
      this.imageUrlPrefix = "/android_asset/www/assets";
    }else if(platform.is("ios")){
      this.imageUrlPrefix = "assets";
    }else{
      this.imageUrlPrefix = "./../assets";
    }

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: '首页', icon: 'home', component: HomePage },
      { title: '目录', icon: 'list', component: CategoryPage },
      { title: '书签', icon: 'bookmark', component: BookmarksPage },
      { title: '历史', icon: 'time', component: HistoryPage },
      { title: '搜索', icon: 'search', component: SearchPage },
      { title: '设置', icon: 'settings', component: SettingsPage },
      { title: '关于', icon: 'mail', component: AboutPage },
    ];

  }

  initializeApp() {
    
    // Retrieve saved settings from storage
    this.settingsService.getFontSize().subscribe(val => this.selectedFontSize = val);
    this.settingsService.getActiveTheme().subscribe(val => this.selectedMode = val);

    this.storageServices.getSetting(SettingsService.KEY_SELECTED_MODE).then(data=>{
      console.log("Retrieved selectedMode:" + data);
      this.selectedMode = data;
      if(this.selectedMode === SettingsService.DARK_THEME){
        this.settingsService.setActiveTheme(SettingsService.DARK_THEME);
      }else{
        this.settingsService.setActiveTheme(SettingsService.LIGHT_THEME);
      }
    });
    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.splashScreen) {
        setTimeout(() => {
          this.splashScreen.hide();
        }, 300);
      }
      this.statusBar.styleDefault();
    });

    this.platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNav();
      let activeView: ViewController = nav.getActive();
      if(activeView != null){
        if(nav.canGoBack()) {
          nav.pop();
        }else if (typeof activeView.instance.backButtonAction === 'function'){
          activeView.instance.backButtonAction();
        }
      }
    });

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      console.log('Google analytics is ready now');
         this.ga.trackView('初始页');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
