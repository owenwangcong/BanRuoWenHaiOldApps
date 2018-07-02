import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import { Category } from '../models/category';
import { Book } from '../models/book';
import { Juan } from '../models/juan';
import { Node } from '../models/node';
import { BookNode } from '../models/bookNode';
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
  public static TRACKER_ID:string = "UA-111883791-3";

  categoryList:Category[];
  public bookList:Book[];
  bookmarks:Bookmark[];
  histories:History[];
  lastReadHistory:History;

  constructor(private http: Http, private storage:Storage, private storageServices:StorageServices, private splashScreen:SplashScreen) {
    
    console.debug('Constructing global variables');
    
    // Initialize the last read history
    this.lastReadHistory = undefined;
    this.getAllHistories();
    this.getAllBookmarks();    
    
    this.parseLongZang().subscribe(data => {
      this.categoryList = data;
      console.log("Categories size:" + this.categoryList.length);

      this.bookList = [];
      let bookCount = 0;
      for (let category of this.categoryList) {
        for(let book of category.books){
          this.bookList[bookCount] = book;
          bookCount++;
        }
      }
      this.splashScreen.hide();      
      console.log("Book list size:" + this.bookList.length);
    }, error => console.error(error));  

    console.debug('Global variables constructed');

  }

  getCategoryList() {
    return this.categoryList;
  }

  public getSectionsDict(){

  }

  private parseLongZang(): Observable<any> {
    return this.http.get("input/longzang.json")
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