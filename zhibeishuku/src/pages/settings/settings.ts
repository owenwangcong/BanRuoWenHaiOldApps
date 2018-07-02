import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { SettingsService } from '../../providers/settingsService';
import { StorageServices } from '../../providers/storageServices';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { GlobalVars } from '../../providers/globalVars';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  isNightMode: Boolean;
  selectedMode: String;
  selectedFontSize: String;
  selectedBackground: String = 'none';
  
  images: Array<string> = ['none', 'paper', 'grey', 'wood'];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private settings: SettingsService, private storageServices:StorageServices, private ga: GoogleAnalytics, public globalVars:GlobalVars) {
    this.settings.getActiveTheme().subscribe(val => this.selectedMode = val);
    this.settings.getFontSize().subscribe(val => this.selectedFontSize = val);
    this.settings.getBackground().subscribe(val => this.selectedBackground = val);
    
    this.storageServices.getSetting(SettingsService.KEY_SELECTED_MODE).then(data=>{
      this.selectedMode = data;
      if(this.selectedMode === SettingsService.DARK_THEME){
        this.isNightMode = true;
      }else{
        this.isNightMode = false;
      }
    });

    this.storageServices.getSetting(SettingsService.KEY_FONT_SIZE).then(data=>{
      this.selectedFontSize = data==null?SettingsService.FONT_SIZE_MEDIUM:data;
    });

    this.storageServices.getSetting(SettingsService.KEY_BACKGROUND).then(data=>{
      this.selectedBackground = data==null?SettingsService.BACKGROUND_NONE:data;
    });

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('设置');
    })
    .catch(e => console.log('Error starting GoogleAnalytics', e));

  }

  notifyNightModeChange(){
    if (this.isNightMode == true) {
      this.selectedMode = SettingsService.DARK_THEME;
    }else{
      this.selectedMode = SettingsService.LIGHT_THEME;
    }
    this.settings.setActiveTheme(this.selectedMode);
    this.storageServices.saveSetting(SettingsService.KEY_SELECTED_MODE, this.selectedMode.toString());
  }

  notifyFontSizeChange(){
    console.log("Font size changed to " + this.selectedFontSize);
    this.settings.setFontSize(this.selectedFontSize);
    this.storageServices.saveSetting(SettingsService.KEY_FONT_SIZE, this.selectedFontSize.toString());
  }

	notifyBackgroundChange(image) {
    console.log("Background changed to " + image);
    this.settings.setBackground(image);
    this.storageServices.saveSetting(SettingsService.KEY_BACKGROUND, image.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Settings');
  }

  backButtonAction(){
    this.menuCtrl.toggle();
  }

  prepareImageSelector() {
		setTimeout(() => {
			let buttonElements = document.querySelectorAll('div.alert-radio-group button');
			if (!buttonElements.length) {
				this.prepareImageSelector();
			} else {
				for (let index = 0; index < buttonElements.length; index++) {
					let buttonElement = buttonElements[index];
					let optionLabelElement = buttonElement.querySelector('.alert-radio-label');
					let image = optionLabelElement.innerHTML.trim();
					buttonElement.classList.add('imageselect', 'image_' + image);
					if (image == this.selectedBackground) {
						buttonElement.classList.add('imageselected');
					}
				}
			}
		}, 100);
	}

	selectImage(image) {
		let buttonElements = document.querySelectorAll('div.alert-radio-group button.imageselect');
		for (let index = 0; index < buttonElements.length; index++) {
			let buttonElement = buttonElements[index];
			buttonElement.classList.remove('imageselected');
			if (buttonElement.classList.contains('image_' + image)) {
				buttonElement.classList.add('imageselected');
			}
		}
  }
  
}
