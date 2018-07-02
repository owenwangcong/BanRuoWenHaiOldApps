import { Pipe, PipeTransform } from '@angular/core';
import { Platform } from 'ionic-angular';

@Pipe({ name: 'image' })
export class ImagePipe implements PipeTransform {
  constructor(private plt: Platform) {}
  transform(value: string): string {
  if(this.plt.is("android")){
      var regEx = /<img src=\"\.\.\//gi; 
      return value.replace(regEx, '<img src="/android_asset/www/'); 
  }if(this.plt.is("ios")){
    var regEx = /<img src=\"\.\.\//gi; 
    return value.replace(regEx, '<img src="'); 
  }else{
        return value;
    }    
  }
} 