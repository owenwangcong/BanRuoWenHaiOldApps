import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController, AlertOptions, AlertInputOptions } from 'ionic-angular';

import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StorageServices } from '../../providers/storageServices';
import { Bookmark } from '../../models/bookmark';
import { ArticlePage } from '../article/article';

@IonicPage()
@Component({
  selector: 'page-bookmarks',
  templateUrl: 'bookmarks.html',
})
export class BookmarksPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public globalVars:GlobalVars, public alertCtrl: AlertController, public storageServices:StorageServices, private ga: GoogleAnalytics) {
    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('书签页');
        })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Bookmarks');
  }

  presentDeleteConfirm(bookmark:Bookmark) {
    let alert = this.alertCtrl.create({
      title: '删除书签',
      message: '确认删除书签？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('开始删除'+bookmark.bookMarkName);
            this.storageServices.removeBookmark(bookmark).then(data => {
              setTimeout(() => this.globalVars.getAllBookmarks(), 1);
            });            
          }
        }
      ]
    });
    alert.present();
  }

presentDeleteAllConfirm() {
    let alert = this.alertCtrl.create({
      title: '删除所有书签',
      message: '确认删除所有书签？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('开始删除所有书签');
            this.storageServices.removeAllBookmarks().then(data => {
              setTimeout(() => this.globalVars.getAllBookmarks(), 1);
            });
          }
        }
      ]
    });
    alert.present();
  }

  gotoArticle(bookmark:Bookmark) {
    var bookName = this.getBookName(bookmark);
    this.navCtrl.push(ArticlePage, {bookName:bookName, volume:bookmark.volume, volumes:bookmark.volumes, volumeIndex:bookmark.volumeIndex, scrollPosition:bookmark.scrollPosition});
  }

  getBookName(bookmark:Bookmark){
    var bookName;
    if(bookmark.bookMarkName.includes('-')){
      bookName = bookmark.bookMarkName.split("-")[0];
    }else{
      bookName = null;
    }
    return bookName;
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }
}
