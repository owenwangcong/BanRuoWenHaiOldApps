import { NgModule } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { BookPage } from './book';

@NgModule({
  declarations: [
    BookPage,
  ],
  imports: [
    IonicPageModule.forChild(BookPage),
  ],
  exports: [
    BookPage
  ]
})
export class BookModule {}
