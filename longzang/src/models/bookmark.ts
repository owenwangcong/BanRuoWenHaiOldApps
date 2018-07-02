import { Book } from './book';

export class Bookmark{
    id:string;
    key:string;
    bookMarkName:string;
    scrollPosition:number;
    percentage:number;
    date: Date;
    book: Book;

    constructor(id:string, bookMarkName:string, scrollPosition:number, percentage:number, book: Book){
        this.id = id;
        this.bookMarkName = bookMarkName;
        this.scrollPosition = scrollPosition;
        this.percentage = percentage;
        this.book = book;
        this.date = new Date();
    }

}