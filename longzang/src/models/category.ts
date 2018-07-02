import { Book } from './book';

export class Category{
  name:string;
  url:string;
  books:Book[];

  constructor(name:string, url:string, books:Book[]){
      this.name = name;
      this.url = url;
      this.books = books;
  }

}