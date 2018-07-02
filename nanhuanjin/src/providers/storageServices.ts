import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Bookmark } from '../models/bookmark';
import { History } from '../models/history';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StorageServices {

    public static BOOKMARK:string = "Bookmark-";
    public static HISTORY:string = "History-";
    public static SETTINGS:string = "Settings-";
    
    constructor(private storage: Storage) {

    }

    /* Settings */

    saveSetting(key:string, value:string){
        this.storage.set(StorageServices.SETTINGS + key, value);
        console.log("Saved to " + StorageServices.SETTINGS + key + ":" + value);
    }

    getSetting(key:string){
        return this.storage.get(StorageServices.SETTINGS + key);
    }

    /* Bookmarks */

    saveBookmark(bookmark:Bookmark){
        /* Need to add an unique string to key to allow multiple bookmarks in one article */
        bookmark.key = this.generateBookmarkKeyFromId(bookmark.id);
        this.storage.set(bookmark.key, JSON.stringify(bookmark));
        console.log("Bookmark saved:" + JSON.stringify(bookmark));
    }

    getBookmarkById(id:string){
        return this.storage.get(this.generateBookmarkKeyFromId(id));
    }

    removeBookmark(bookmark:Bookmark){
      return this.storage.forEach((value, key, index) => {
            if(key==bookmark.key){
              console.log("Deleting " + bookmark.bookMarkName);
              this.storage.remove(bookmark.key);
            }
        });
    }

    removeAllBookmarks(){
        return this.storage.forEach((value, key, index) => {
            if(key.indexOf(StorageServices.BOOKMARK) >= 0){
                this.storage.remove(key);
            }
        });
    }

    /* History */

    saveHistory(history:History){
        history.key = this.generateHistoryKeyFromId(history.id);
        this.storage.set(history.key, JSON.stringify(history));
        console.log("History saved:" + JSON.stringify(history));
    }

    getHistoryById(id:string){
        return this.storage.get(this.generateHistoryKeyFromId(id));
    }

    removeHistory(history:History){
      return this.storage.forEach((value, key, index) => {
            if(key==history.key){
              console.log("Deleting " + history.historyName);
              this.storage.remove(history.key);
            }
        });
    }

    removeAllHistories(){
        return this.storage.forEach((value, key, index) => {
            if(key.indexOf(StorageServices.HISTORY) >= 0){
                this.storage.remove(key);
            }
        });
    }

    randomString(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }

    /**
     * Storage key generator for bookmark
     * @param id 
     */
    public generateBookmarkKeyFromId(id:string):string{
        return StorageServices.BOOKMARK + id + "-" + this.randomString(8,'#aA');
    }

    /**
     * Storage key generator for history
     * @param id 
     */
    public generateHistoryKeyFromId(id:string):string{
        return StorageServices.HISTORY + id;
    }

}