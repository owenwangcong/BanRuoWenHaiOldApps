import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { Category } from '../../models/category';
import { Book } from '../../models/book';
import { BookPage } from '../book/book';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  private categoryList:Category[];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public navParams: NavParams, private http: Http, private globalVars:GlobalVars, private ga: GoogleAnalytics) {

    this.categoryList = globalVars.getCategoryList();

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('选择目录');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));

  }

  ionViewDidLoad() {
    
    console.log("category page loaded.");

  }

  goToBookPage(categoryName:string, books: Book[]) {
    this.navCtrl.push(BookPage, {categoryName, books});
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }
}
