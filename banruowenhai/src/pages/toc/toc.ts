import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { Section } from '../../models/section';

@IonicPage()
@Component({
  selector: 'page-toc',
  templateUrl: 'toc.html',
})
export class TocPage {

  private sectionArray:Section[];

  private callback;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.sectionArray = navParams.get('sectionArray') as Section[];
    console.debug("Toc:" + JSON.stringify(this.sectionArray));
    console.debug("Toc size:" + this.sectionArray.length);

    this.callback = navParams.get('callback');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Toc');
  }

  scrollToSection(href:string){
    console.log('Jump to ' + href);
    this.callback(href);
  }

  scrollToTop(){
    console.log('Jump to top');
    this.callback("top");
  }

  scrollToBottom(){
    console.log('Jump to bottom');
    this.callback("bottom");
  }

}
