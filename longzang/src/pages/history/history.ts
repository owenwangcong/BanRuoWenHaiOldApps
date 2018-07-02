import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AlertController, AlertOptions, AlertInputOptions } from 'ionic-angular';

import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StorageServices } from '../../providers/storageServices';
import { History } from '../../models/history';
import { ArticlePage } from '../article/article';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public globalVars:GlobalVars, public alertCtrl: AlertController, public storageServices:StorageServices, private ga: GoogleAnalytics) {
    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('阅读历史');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  ionViewDidLoad() {
    console.log("history loaded");
  }

  presentDeleteConfirm(history:History) {
    let alert = this.alertCtrl.create({
      title: '从历史记录删除'+history.historyName,
      message: '确认删除？',
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
            console.log('开始删除'+history.historyName);
            this.storageServices.removeHistory(history).then(data => {
              setTimeout(() => this.globalVars.getAllHistories(), 1);
            });            
          }
        }
      ]
    });
    alert.present();
  }

presentDeleteAllConfirm() {
    let alert = this.alertCtrl.create({
      title: '删除所有历史',
      message: '确认删除所有历史？',
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
            console.log('开始删除所有历史');
            this.storageServices.removeAllHistories().then(data => {
              setTimeout(() => this.globalVars.getAllHistories(), 1);
            });
          }
        }
      ]
    });
    alert.present();
  }

  gotoArticle(history:History) {
    this.navCtrl.push(ArticlePage, {book:history.book, sectionUrl:null, scrollPosition:history.scrollPosition});
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }
}