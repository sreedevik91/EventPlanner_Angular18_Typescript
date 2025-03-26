export class salesSearchFilter {
    pageNumberService: string;
    pageNumberEvent: string;
    pageSize: string;
    sortByService: string;
    sortOrderService: string;
    sortByEvent: string;
    sortOrderEvent: string;
    startDate: string;
    endDate:string;
    filterBy:string;
   

    constructor() {
        this.pageNumberService = '1'
        this.pageNumberEvent = '1'
        this.pageSize = '2'
        this.startDate='';
        this.endDate='';
        this.filterBy=''
        this.sortByService=''
        this.sortOrderService = 'asc'
        this.sortByEvent=''
        this.sortOrderEvent = 'asc'
    }
}

export class salesForm{
    startDate: Date;
    endDate:Date;
    filterBy:string;

    constructor(){
        this.startDate=new Date();
        this.endDate=new Date();
        this.filterBy=''
    }
}

export class providerSalesSearchFilter {
    providerId:string;
    pageNumberService: string;
    pageSize: string;
    sortByService: string;
    sortOrderService: string;
    startDate: string;
    endDate:string;
    filterBy:string;
   

    constructor() {
        this.providerId=''
        this.pageNumberService = '1'
        this.pageSize = '2'
        this.startDate='';
        this.endDate='';
        this.filterBy=''
        this.sortByService=''
        this.sortOrderService = 'asc'
    }
}
