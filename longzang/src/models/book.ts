import { Juan } from './juan';

export class Book{
    name:string;
    url:string;
    author:string;
    bu:string;
    ce:string;
    juan:string;
    juans:Juan[];

    constructor(name:string, url:string, author:string, bu:string, ce:string, juan:string, juans:Juan[]){
        this.name = name;
        this.url = url;
        this.author = author;
        this.bu = bu;
        this.ce = ce;
        this.juan = juan;
        this.juans = juans;
    }

}