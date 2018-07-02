import { Book } from './book';

export class History{
    id:string;
    key:string;
    historyName:string;
    scrollPosition:number;
    percentage:number;
    date: Date;
    book:Book;

    constructor(id:string, historyName:string, scrollPosition:number, percentage:number, book:Book){
        this.id = id;
        this.historyName = historyName;
        this.scrollPosition = scrollPosition;
        this.percentage = percentage;
        this.book = book;
        this.date = new Date();
    }

}