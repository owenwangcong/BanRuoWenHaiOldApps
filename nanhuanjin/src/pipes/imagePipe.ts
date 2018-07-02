import { Pipe, PipeTransform } from '@angular/core';
import { Platform } from 'ionic-angular';

@Pipe({ name: 'image' })
export class ImagePipe implements PipeTransform {
  constructor(private plt: Platform) {}
  transform(value: string): string {
    var regEx = /<img src=\"\.\.\/pic/gi; 
    if(this.plt.is("android")){
        return value.replace(regEx, '<img src="/android_asset/www/images/other'); 
    }else{
        return value.replace(regEx, '<img src="./../assets/images/other'); 
    }    
  }
} 