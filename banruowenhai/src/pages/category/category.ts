import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { Node } from '../../models/node';
import { BookNode } from '../../models/bookNode';
import { BookPage } from '../book/book';

import * as JSZip  from '../../assets/scripts/jszip';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  private categoryList:Node[];
  //private bookList:BookNode[];
  //private categoryDict;

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

  goToBookPage(category: string) {
    this.navCtrl.push(BookPage, {category});
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }
}
