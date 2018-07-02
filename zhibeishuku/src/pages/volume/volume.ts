import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GlobalVars } from '../../providers/globalVars';
import { BookNode } from '../../models/bookNode';
import { Node } from '../../models/node';
import { ArticlePage } from '../article/article';

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

  private book:BookNode;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.book = navParams.get('book');
    console.log(this.book.volumes);
  }

  ionViewDidLoad() {
  }

  gotoArticle(bookName, volumes, i) {
    this.navCtrl.push(ArticlePage, {bookName:bookName,volume:null, volumes:volumes, volumeIndex:i, scrollPosition:null});
  }

}
