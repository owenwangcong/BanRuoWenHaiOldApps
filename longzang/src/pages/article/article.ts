import { Component, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { IonicPage, NavController, PopoverController, NavParams, Content, List, Header} from 'ionic-angular';
import { Book } from '../../models/book';
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

  // The following three are passed in togather
  private book:Book;
  private sectionUrl:string;
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

    this.book = navParams.get('book');
    this.sectionUrl = navParams.get('sectionUrl');
    this.scrollPosition = navParams.get('scrollPosition');

    this.firstAutoScollFlag = false;

    this.getContent(plt).subscribe(data => {
      this.isLoading = false;
      console.log("done: this.isLoading:" + this.isLoading);
      this.paragraphArray = data._body.split('\r'); 
    }, error => console.log(error));

    this.ga.startTrackerWithId(GlobalVars.TRACKER_ID)
    .then(() => {
      this.ga.setAllowIDFACollection(true);
      this.ga.trackView('文章:' + this.book.name);
        })
    .catch(e => console.log('Error starting GoogleAnalytics', e));
  } 

  private getContent(plt: Platform): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'text/plain; charset=utf8' }); 
    let options = new RequestOptions({ headers: headers });

    if(plt.is("android")){
      this.url = "/android_asset/www/books/" + this.book.url.replace("http://www.qldzj.com/htmljw/","");
    }else if(plt.is("ios")){
      this.url = "books/" + this.book.url.replace("http://www.qldzj.com/htmljw/","");
    }else{
      this.url = "books/" + this.book.url.replace("http://www.qldzj.com/htmljw/","");
    }
    return this.http.get(this.url,options);
  }

  addBookmark(){

    console.debug("Current position:" + this.docScollPosition);

    let bm = new Bookmark(
      this.book.url, 
      this.book.name,
      this.docScollPosition,
      (this.docScollPosition==null)?0:Math.round(100*(this.docScollPosition/this.docFullHeight)),
      this.book
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
            bm.book = this.book;
            this.storageServices.saveBookmark(bm);
            setTimeout(() => this.globalVars.getAllBookmarks(), 500);
          }
        }
      ]
    });
    prompt.present();
  }

  showToc(myEvent) {
    let popover = this.popoverCtrl.create(TocPage, {juans:this.book.juans, callback: function(target:string) {
        console.info("back to target:" + target);
        var el = document.getElementById(target) as HTMLElement;
        if (el !== null) {
          el.scrollIntoView(true);
          setTimeout(() => popover.dismiss(), 100);
          console.debug("Jumpped to " + target);
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

      /*
       Four ways to enter:
        1. 继续上次的阅读：sectionUrl==null, position!=null;
        2. 点击章节：sectionUrl!=null, position==null; 
        3. 从历史记录进入：sectionUrl=null, position!=null;
        4. 从书签进入：sectionUrl=null, position!=null;
      */

      if((!this.firstAutoScollFlag) && (paragraphList.childElementCount==this.paragraphArray.length)){ 
        if(this.sectionUrl==null && this.scrollPosition!=null){
          // If a position is passed when load the page, scroll to that position
          console.info("scroll to position:"+this.scrollPosition);
          setTimeout(() => this.content.scrollTo(0, this.scrollPosition), 200);
        }else if(this.sectionUrl!=null && this.scrollPosition==null){
          console.info("scroll to section:"+this.sectionUrl);
          var el = document.getElementById(this.sectionUrl) as HTMLElement;
          if (el !== null) {
            el.scrollIntoView(true);
          }
        }
        this.firstAutoScollFlag = true;      
      }
    }
  }

  ngOnDestroy(){

    /*Free up resources*/
    this.paragraphArray = null;

    this.saveHistory();

    setTimeout(() => this.globalVars.getAllHistories(), 100);
  }

  saveHistory(){
    /* Save reading history */    
    let history = new History(this.book.url, this.book.name, this.docScollPosition, (this.docScollPosition==0 || this.docScollPosition==null)?0:Math.round(100*(this.docScollPosition/this.docFullHeight)), this.book);
    this.storageServices.saveHistory(history);
  }

  scroll(){
    this.content.scrollTo(0, this.content.scrollTop + this.content.contentHeight - this.content.contentHeight * 0.075);  
  }

}
