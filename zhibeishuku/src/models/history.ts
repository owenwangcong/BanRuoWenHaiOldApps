import { Node } from './node';

export class History{
    id:string;
    key:string;
    historyName:string;
    scrollPosition:number;
    percentage:number;
    date: Date;
    volume:Node;
    volumes:Node[];
    volumeIndex:number;

    constructor(id:string, historyName:string, scrollPosition:number, percentage:number, volume:Node, volumes:Node[], volumeIndex:number){
        this.id = id;
        this.historyName = historyName;
        this.scrollPosition = scrollPosition;
        this.percentage = percentage;
        this.date = new Date();
        this.volume = volume;
        this.volumes = volumes;
        this.volumeIndex = volumeIndex;
    }

}