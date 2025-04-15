export class Service {
    _id:string;
    name: string;
    img:string;
    events: string[];
    provider: string;
    choices: IChoice[];

    constructor(){
        this._id=''
        this.name=''
        this.img=''
        this.events=[]
        this.provider=''
        this.choices=[{choiceName:'',choicePrice:0,choiceType:'',choiceImg:'',choiceImgCategory:''}]
    }
}

export interface IChoice {
    choiceName: string;
    choiceType: string;
    choicePrice: number;
    choiceImg:string;
    choiceImgCategory:string;
}

export class AdminService {

    services: string[];
    // events: string[];

    constructor(){
        this.services=[]
        // this.events=[]
    } 
}


// export class Service {
//     _id:string;
//     name: string;
//     events: string[];
//     provider: string;
//     choices: IChoice[];

//     constructor(){
//         this._id=''
//         this.name=''
//         this.events=[]
//         this.provider=''
//         this.choices=[{choiceName:'',choicePrice:0,choiceType:''}]
//     }
// }

// export interface IChoice {
//     choiceName: string;
//     choiceType: string;
//     choicePrice: number;
// }














export class ServiceSearchFilter{
    serviceName: string;
    isApproved:string;
    provider:string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;

    constructor(){
        this.serviceName=''
        this.isApproved=''
        this.provider=''
        this.pageNumber='1'
        this.pageSize='2'
        this.sortBy=''
        this.sortOrder='asc'
    }
}