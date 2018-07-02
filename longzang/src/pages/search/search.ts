import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SearchService } from '../../providers/searchService';
import { Book } from '../../models/book';
import { VolumePage } from '../volume/volume';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = '';

  books: Book[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public menuCtrl: MenuController, public globalVars:GlobalVars, public searchService: SearchService, private ga: GoogleAnalytics) {
    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('搜索');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  setFilteredItems() {
    this.searchService.filterItemsAsync(this.searchQuery).then(data=>{
      console.log('Search result loaded.');
      this.books = data as Book[];
    });
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad Search');

    this.setFilteredItems();

  }

  search(){
     this.setFilteredItems();
  }

  goToVolume(book: Book) {
    this.navCtrl.push(VolumePage, {categoryName:null, book});
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }

}
