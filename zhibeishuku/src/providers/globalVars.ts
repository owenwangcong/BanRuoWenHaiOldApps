import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Node } from '../models/node';
import { BookNode } from '../models/bookNode';
import { Category } from '../models/category';
import { Bookmark } from '../models/bookmark';
import { History } from '../models/history';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { StorageServices } from './storageServices';
import { SplashScreen } from '@ionic-native/splash-screen';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GlobalVars {

  public static BOOKMARK:string = "BOOKMARK";
  public static HISTORY:string = "HISTORY";
  public static TRACKER_ID:string = "UA-111883791-2";

  categoryDict;
  categoryList:Node[];
  bookList:BookNode[];
  sectionsDict;

  bookmarks:Bookmark[];
  histories:History[];
  lastReadHistory:History;
  
  readyCount = 0;

  constructor(private http: Http, private storage:Storage, private storageServices:StorageServices, private splashScreen:SplashScreen) {

    console.debug('Constructing global variables');
    
    // Initialize the last read history
    this.lastReadHistory = undefined;
    this.getAllHistories();
    this.getAllBookmarks();    
    
    //Load categories
    this.parseCategories().subscribe(data => {
      this.categoryList = data;
      this.checkAndHideSplash();
    }, error => console.error(error));  

    //Load category dict
    this.parseCategoryDict().subscribe(data => {
        this.categoryDict = data
        this.checkAndHideSplash();
      }, error => console.error(error));  

    //Load books
    this.parseBooks().subscribe(data => {
      this.bookList = data;
      this.checkAndHideSplash();
      console.debug("Total books loaded:" + this.bookList.length);
    }, error => console.error(error));

    console.debug('Global variables constructed');

  }

  public checkAndHideSplash(){
    this.readyCount++;
    console.log("Ready count:" + this.readyCount);
    if(this.readyCount==4){
      this.splashScreen.hide();
      console.log("Hiding splash screen");
    }
  }

  getCategoryList() {
    return this.categoryList;
  }

  getBookList() {
    return this.bookList;
  }

  getCategoryDict() {
    return this.categoryDict;
  }

  getSectionsDict() {
    return this.sectionsDict;
  }

  private parseCategories(): Observable<any> {
    return this.http.get("input/categoryList.json")
                    .map((res:any) => res.json())
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
 
  private parseCategoryDict(): Observable<any> {
    return this.http.get("input/categoryDict.json")
                    .map((res:any) => res.json())
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  private parseBooks(): Observable<any> {
    return this.http.get("input/bookList.json")
                    .map((res:any) => res.json())
                    .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public getAllBookmarks(){
        let bookmarks:Bookmark[]=[];
        return this.storage.forEach((value, key, index) => {
            if(key.indexOf(StorageServices.BOOKMARK) >= 0){
                let bm = JSON.parse(value) as Bookmark;
                bookmarks.push(bm);
            }
        }).then(data => {
          this.bookmarks = bookmarks;
          console.log("Number of Bookmarks loaded:" + this.bookmarks.length);
        });
    }

    public getAllHistories(){
        let histories:History[]=[];
        return this.storage.forEach((value, key, index) => {
            if(key.indexOf(StorageServices.HISTORY) >= 0){
                let ht = JSON.parse(value) as History;
                histories.push(ht);
            }
        }).then(data => {
          this.histories = histories.sort((a: History, b: History) => {
            if(a.date > b.date){
              return -1;
            }
            if(a.date < b.date){
              return 1;
            }
            return 0;
          });
          this.lastReadHistory = this.histories[0];
          console.log("Number of Histories loaded:" + this.histories.length);
        });
    }

}