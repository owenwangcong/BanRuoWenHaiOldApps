import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  public imageUrlPrefix:string

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private ga: GoogleAnalytics, public globalVars:GlobalVars, private plt: Platform) {

    if(plt.is("android")){
      this.imageUrlPrefix = "/android_asset/www/assets";
    }else if(plt.is("ios")){
      this.imageUrlPrefix = "assets";
    }else{
      this.imageUrlPrefix = "./../assets"
    }

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('关于');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad About');
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }

}
