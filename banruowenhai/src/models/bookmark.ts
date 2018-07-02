import { Node } from './node';

export class Bookmark{
    id:string;
    key:string;
    bookMarkName:string;
    scrollPosition:number;
    percentage:number;
    date: Date;
    volume: Node;
    volumes:Node[];
    volumeIndex:number;

    constructor(id:string, bookMarkName:string, scrollPosition:number, percentage:number, volume:Node, volumes:Node[], volumeIndex:number){
        this.id = id;
        this.bookMarkName = bookMarkName;
        this.scrollPosition = scrollPosition;
        this.percentage = percentage;
        this.date = new Date();
        this.volume = volume;
        this.volumes = volumes;
        this.volumeIndex = volumeIndex;
    }

}