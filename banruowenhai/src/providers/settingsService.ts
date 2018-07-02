import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
 
@Injectable()
export class SettingsService {
 
    public static LIGHT_THEME:string = "light-theme";
    public static DARK_THEME:string = "dark-theme";
    public static KEY_SELECTED_MODE:string = "selectedMode";

    public static FONT_SIZE_SMALL:string = "small-font";
    public static FONT_SIZE_MEDIUM:string = "medium-font";
    public static FONT_SIZE_LARGE:string = "large-font";
    public static KEY_FONT_SIZE:string = "selectedFontSize";
         
    public static BACKGROUND_NONE:string = "none";
    public static BACKGROUND_PAPER:string = "paper";
    public static BACKGROUND_GREY:string = "grey";
    public static BACKGROUND_WOOD:string = "wood";
    public static KEY_BACKGROUND:string = "selectedBackground";
   
    private theme: BehaviorSubject<String>;
    private fontSize: BehaviorSubject<String>;
    private background: BehaviorSubject<String>;
    
    constructor() {
        this.theme = new BehaviorSubject(SettingsService.LIGHT_THEME);
        this.fontSize = new BehaviorSubject(SettingsService.FONT_SIZE_MEDIUM);
        this.background = new BehaviorSubject(SettingsService.BACKGROUND_NONE);
    }
 
    setActiveTheme(val) {
        this.theme.next(val);
    }
 
    getActiveTheme() {
        return this.theme.asObservable();
    }

    setFontSize(val) {
        this.fontSize.next(val);
    }
 
    getFontSize() {
        return this.fontSize.asObservable();
    }

    setBackground(val) {
        this.background.next(val);
    }
 
    getBackground() {
        return this.background.asObservable();
    }
}