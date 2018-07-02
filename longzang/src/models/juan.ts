import { Pin } from './pin';

export class Juan{
    
    name:string;
    url:string;
    pins:Pin[];

    constructor(name:string, url:string, pins:Pin[]){
        this.name = name;
        this.url = url;
        this.pins = pins;
    }

}