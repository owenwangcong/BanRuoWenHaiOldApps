import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalVars';
import { ArticlePage } from '../article/article';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private imageUrlPrefix:string;

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private plt: Platform, public globalVars:GlobalVars) {
    if(plt.is("android")){
      this.imageUrlPrefix = "/android_asset/www/assets";
    }else if(plt.is("ios")){
      this.imageUrlPrefix = "assets";
    }else{
      this.imageUrlPrefix = "./../assets"
    }
  }

  continue(){
    var history = this.globalVars.lastReadHistory;
    var bookName;
    if(history.historyName.includes('-')){
      bookName = history.historyName.split("-")[0];
    }else{
      bookName = null;
    }
    this.navCtrl.push(ArticlePage, {bookName, volume:history.volume, volumes:history.volumes, volumeIndex:history.volumeIndex, scrollPosition:history.scrollPosition});
  }


  backButtonAction(){
    this.menuCtrl.toggle();
  }
}
