import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalVars';
import { History } from '../../models/history';
import { Book } from '../../models/book';
import { Node } from '../../models/node';
import { ArticlePage } from '../article/article';
import { StorageServices } from '../../providers/storageServices';

/**
 * Generated class for the Test3 page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-volume',
  templateUrl: 'volume.html',
})
export class VolumePage {

  private imageUrlPrefix:string
  private categoryName:string;
  private book:Book;
  private history:History;

  constructor(public navCtrl: NavController, public navParams: NavParams, private plt:Platform, private storageServices:StorageServices) {

    if(plt.is("android")){
      this.imageUrlPrefix = "/android_asset/www/assets";
    }else if(plt.is("ios")){
      this.imageUrlPrefix = "assets";
    }else{
      this.imageUrlPrefix = "./../assets"
    }

    this.categoryName = navParams.get('categoryName');
    this.book = navParams.get('book');
    console.log("Volume:123:" + this.book.name);
    this.book.author.replace(" ", "");
  }

  ionViewWillEnter() {
    setTimeout(() => 
      this.storageServices.getHistoryById(this.book.url).then(data=>{
        this.history = JSON.parse(data) as History;
        if(this.history!=null){
          console.info('History found for ' + this.history.historyName);
        }else{
          console.info('No history found.');
        }
      })
    , 500); 
  }

  ionViewDidLoad() {
  }

  goToArticlePage(book:Book, sectionUrl:string, scrollPosition:number) {
    this.navCtrl.push(ArticlePage, {book, sectionUrl, scrollPosition});
  }

}
