import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { Juan } from '../../models/juan';

@IonicPage()
@Component({
  selector: 'page-toc',
  templateUrl: 'toc.html',
})
export class TocPage {

  private juans:Juan[];

  private callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.juans = navParams.get('juans') as Juan[];
    console.debug("Toc:" + JSON.stringify(this.juans));
    console.debug("Toc size:" + this.juans.length);

    this.callback = navParams.get('callback');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Toc');
  }

  scrollToSection(url:string){
    console.log('Jump to ' + url.replace("#",""));
    this.callback(url.replace("#",""));
  }

}
