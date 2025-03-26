export class Events {
    _id: string;
    name: string;
    img: string;
    services:string[];

    constructor() {
        this._id = ''
        this.name = ''
        this.img = ''
        this.services=[]
    }
}

export interface IEventService {
    service: string;
    providerId: string;
}

export class EventSearchFilter{
    eventName: string;
    isActive:string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;

    constructor(){
        this.eventName=''
        this.isActive=''
        this.pageNumber='1'
        this.pageSize='2'
        this.sortBy=''
        this.sortOrder='asc'
    }
}