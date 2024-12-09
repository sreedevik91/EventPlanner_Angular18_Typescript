export class Service {
    _id:string;
    name: string;
    events: string[];
    provider: string;
    choices: IChoice[];

    constructor(){
        this._id=''
        this.name=''
        this.events=[]
        this.provider=''
        this.choices=[{choiceName:'',choicePrice:0,choiceType:''}]
    }
}

export interface IChoice {
    choiceName: string;
    choiceType: string;
    choicePrice: number;
}

export class ServiceSearchFilter{
    serviceName: string;
    provider:string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;

    constructor(){
        this.serviceName=''
        this.provider=''
        this.pageNumber='1'
        this.pageSize='2'
        this.sortBy=''
        this.sortOrder='asc'
    }
}