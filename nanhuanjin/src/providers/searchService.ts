import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BookNode } from '../models/bookNode';
import { GlobalVars } from './globalVars';

@Injectable()
export class SearchService {
 
    books: BookNode[];
 
    constructor(public http: Http, private globalVars:GlobalVars) {
        this.books = globalVars.bookList;
    }

    filterItemsAsync(searchTerm){
        return new Promise((resolve, reject) => resolve(
            this.books.filter((book) => {
            return book.name.indexOf(searchTerm) > -1;
            }
        )));
    }
        
}