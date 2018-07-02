import { Component, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams, Content, List, Header} from 'ionic-angular';
import { Node } from '../../models/node';
import { Bookmark } from '../../models/bookmark';
import { Section } from '../../models/section';
import { History } from '../../models/history';
import { TocPage } from '../toc/toc';
import { ToolbarSettingsPage } from '../toolbar-settings/toolbar-settings';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GlobalVars } from '../../providers/globalVars';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StorageServices } from '../../providers/storageServices';
import { SettingsService } from '../../providers/settingsService';
import { Platform } from 'ionic-angular';
import { AlertController, AlertOptions, AlertInputOptions } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { FabContainer } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {

  @ViewChild (Content) content:Content;

  private subPause$:any;

  selectedMode: String
  selectedFontSize: String
  selectedBackground: String
  
  private isLoading:boolean=true;
  private firstAutoScollFlag:boolean=false;
  private docScollPosition:number;
  private docFullHeight:number;

  private bookName:string;
  private volumes:Node[];
  private volumeIndex;
  private volume:Node;
  private previousVolume:Node;
  private nextVolume:Node;
  
  private scrollPosition:number;

  private url:string;

  private data:string;

  private paragraphArray:string[];

  private sectionArray:Section[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public plt: Platform, public alertCtrl: AlertController,public popoverCtrl: PopoverController, public globalVars:GlobalVars, public storageServices:StorageServices, private settings:SettingsService, private ga: GoogleAnalytics) {

    this.settings.getActiveTheme().subscribe(val => this.selectedMode = val);
    this.settings.getFontSize().subscribe(val => this.selectedFontSize = val);
    this.settings.getBackground().subscribe(val => this.selectedBackground = val);
    
    console.log("constructor: this.isLoading:" + this.isLoading);

    this.globalVars = globalVars;

    this.storageServices = storageServices;

    this.storageServices.getSetting(SettingsService.KEY_FONT_SIZE).then(data=>{
      this.selectedFontSize = data==null?SettingsService.FONT_SIZE_MEDIUM:data;
    });

    this.storageServices.getSetting(SettingsService.KEY_BACKGROUND).then(data=>{
      this.selectedBackground = data==null?SettingsService.BACKGROUND_NONE:data;
    });

    this.plt.ready().then(() => {
      this.subPause$=this.plt.pause.subscribe(() => {        
          console.log('****UserdashboardPage PAUSED****');
          this.saveHistory();
      });  
    });

    this.initializePage(navParams.get('bookName'), navParams.get('volume'), navParams.get('volumes'), navParams.get('volumeIndex'), navParams.get('scrollPosition'));
  } 

  private initializePage(bookName, volume, volumes, volumeIndex, scrollPosition){
    this.bookName = bookName;
    this.volumes = volumes;
    this.volumeIndex = volumeIndex;
    if(volume!=null){
      this.volume = volume;
    }else{
      this.volume = this.volumes[this.volumeIndex];
    }
    
    if(this.volumeIndex>0){
      this.previousVolume = this.volumes[this.volumeIndex-1];
      console.log("Previous volume index:" + this.volumeIndex + ". Name:" + this.previousVolume.name);
    }else{
      this.previousVolume = null;
    }
    if(this.volumeIndex+1<this.volumes.length){
      this.nextVolume = this.volumes[this.volumeIndex+1];
      console.log("Next volume index:" + (this.volumeIndex+2) + ". Name:" + this.nextVolume.name);
    }else{
      this.nextVolume = null;
    }

    this.scrollPosition = scrollPosition;

    this.firstAutoScollFlag = false;

    this.getContent(this.plt).subscribe(data => {
      //this.article = data._body;
      this.isLoading = false;
      console.log("done: this.isLoading:" + this.isLoading);
      this.paragraphArray = data._body.split('\r'); 
    }, error => console.log(error));

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('文章:' + this.volume.name);
        })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  private getContent(plt: Platform): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'text/plain; charset=utf8' }); 
    let options = new RequestOptions({ headers: headers });

    var regExS = /\//gi; 
    var regExQ = /\?/gi; 
    var regExD = /\./gi; 
    var regExE = /=/gi; 
    var regExA = /&/gi; 
    this.url = this.volume.url.replace(".html","");
    this.url = this.url.replace(regExS, "-").replace(regExQ, "-").replace(regExD, "-").replace(regExE, "-").replace(regExA, "-"); 

    console.log("Article Url:" + this.url);
    
    if(plt.is("android")){
      this.url = "/android_asset/www/chapters/" + this.url;
    }else if(plt.is("ios")){
      this.url = this.volume.url.replace(".htm",".txt").replace("../","");
    }else{
      this.url = "./chapters/" + this.url;
    }

    return this.http.get(this.url,options);
  }

  addBookmark(){

    console.debug("Current position:" + this.docScollPosition);

    var bookmarkName;   
    if(this.bookName==null){
      bookmarkName = this.volume.name;
    }else{
      bookmarkName = this.bookName + "-" + this.volume.name;
    }
    let bm = new Bookmark(
      this.volume.url, 
      bookmarkName,
      this.docScollPosition,
      (this.docScollPosition==null)?0:Math.round(100*(this.docScollPosition/this.docFullHeight)),
      this.volume,
      this.volumes,
      this.volumeIndex      
    );
    bm.bookMarkName = bm.bookMarkName + ' - ' + bm.percentage + "%";

     let prompt = this.alertCtrl.create({
      title: '加入书签',
      message: "将此处加入书签",
      inputs: [
        {
          name: '书签名称',
          value: bm.bookMarkName,
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '保存',
          handler: data => {
            console.debug('Saved bookmark:' + data.书签名称);
            bm.bookMarkName = data.书签名称;
            bm.volume = this.volume;
            this.storageServices.saveBookmark(bm);
            setTimeout(() => this.globalVars.getAllBookmarks(), 500);
          }
        }
      ]
    });
    prompt.present();
  }

  showToc(myEvent) {
    let popover = this.popoverCtrl.create(TocPage, {sectionArray:this.sectionArray, callback: function(target:string) {

        var targetName:string;
        if(target=='top'||target=='bottom'){
          targetName = target;
        }else{
          targetName = target.substring(1,target.length);
        }

        console.debug("back to target:" + targetName);
        var el = document.getElementsByName(targetName)[0] as HTMLElement;
        if (el !== null) {
          el.scrollIntoView(true);
          setTimeout(() => popover.dismiss(), 100);
          console.debug("Jumpped to " + targetName);
        }
      }});
    popover.present({
      ev: myEvent
    });
  }

  showSettings(myEvent){
    let popover = this.popoverCtrl.create(ToolbarSettingsPage, {callback: function(target:string) {      
      setTimeout(() => popover.dismiss(), 10);
    }});
    popover.present({
      ev: myEvent
    });
  }

  gotoPreviousVolume(){
    this.initializePage(this.bookName, null, this.volumes, this.volumeIndex-1, 0);
  }

  gotoNextVolume(){
    this.initializePage(this.bookName, null, this.volumes, this.volumeIndex+1, 0);
  }

  ionViewDidLoad() {

  }

  ionViewWillUnload() {
    this.subPause$.unsubscribe();
  }

  ngAfterViewChecked() {
    /* Subscribe scroll event to update scroll position */
	  this.content.ionScroll.subscribe(($event: any) => {
        this.docScollPosition = event.srcElement.scrollTop;
        this.docFullHeight = event.srcElement.scrollHeight;
    });

    if(this.paragraphArray!=null){
      let paragraphList: HTMLElement = document.getElementById("paragraphList");
      if((!this.firstAutoScollFlag) && (paragraphList.childElementCount==this.paragraphArray.length)){ 
        if(this.scrollPosition!=null){
          console.debug("scroll to position:"+this.scrollPosition);
          setTimeout(() => this.content.scrollTo(0, this.scrollPosition), 100);
        }else{
          this.storageServices.getHistoryById(this.volume.url).then(data=>{
              let history = JSON.parse(data) as History;
              if(history!=null){
                console.debug('History found for ' + history.historyName);
                setTimeout(() => this.content.scrollTo(0, history.scrollPosition), 100);
              }else{
                console.debug('No history found.');
              }
          });
        }
        this.firstAutoScollFlag = true;      
      }
    }
  }

  ngOnDestroy(){

    // Free up resources
    this.paragraphArray = null;

    this.saveHistory();

    // Reload histories
    setTimeout(() => this.globalVars.getAllHistories(), 500);    
    
  }

  /* Save reading history */ 
  saveHistory(){
    var historyName;   
    if(this.bookName==null){
      historyName = this.volume.name;
    }else{
      historyName = this.bookName + "-" + this.volume.name;
    }    
    let history = new History(this.volume.url, historyName, this.docScollPosition, (this.docScollPosition==0 || this.docScollPosition==null)?0:Math.round(100*(this.docScollPosition/this.docFullHeight)), this.volume, this.volumes, this.volumeIndex);
    this.storageServices.saveHistory(history);
  }

  scroll(){
    this.content.scrollTo(0, this.content.scrollTop + this.content.contentHeight - this.content.contentHeight * 0.075);  
  }

}
