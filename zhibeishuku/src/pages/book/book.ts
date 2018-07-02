import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { BookNode } from '../../models/bookNode';
import { VolumePage } from '../volume/volume';
import { ArticlePage } from '../article/article';
import { Node as ArticleNode } from '../../models/node';

/**
 * Generated class for the Test2 page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {

  private category:string;
  private categoryDict;

  constructor(public navCtrl: NavController, public navParams: NavParams, private globalVars:GlobalVars, private ga: GoogleAnalytics) {
    this.category = navParams.get('category');
    this.categoryDict = this.globalVars.getCategoryDict();

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('进入目录：' + this.category);
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  ionViewDidLoad() {
    console.log('BookPage has been loaded.');
  }

  goToVolume(book: BookNode) {
    console.log(book);
    if(book.volumes!=null && book.volumes.length >0){
      this.navCtrl.push(VolumePage, {book});
    }else if(book.volumes==null || book.volumes.length == 0){
      console.log("Show me the article");
      console.log("book.url" + book.url);
      console.log("book.name" + book.name);    
      
      var volume = {
        book:book.name,
        category:"",
        description:"",
        level:"",
        section:"",
        volume:"",
        url:book.url,
        name:book.name
      }
      console.log(volume);
      this.navCtrl.push(ArticlePage, {bookName:book.name, volume:volume, volumes:book.volumes, volumeIndex:null, scrollPosition:null});      
    }
    
  }
}
