import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Book } from '../../models/book';
import { VolumePage } from '../volume/volume';

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

  private categoryName:string;
  private books:Book[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private globalVars:GlobalVars, private ga: GoogleAnalytics) {
    this.categoryName = navParams.get('categoryName');
    this.books = navParams.get('books');
    
    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('进入目录：' + this.categoryName);
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  ionViewDidLoad() {
    console.log('BookPage has been loaded.');
  }

  goToVolume(categoryName:string, book: Book) {
    this.navCtrl.push(VolumePage, {categoryName, book});
  }
}
