export class Booking {
    _id: string;
    userId: string;
    user: string;
    serviceId?: string;
    providerId?: string;
    // eventId?: string;
    event?: string;
    style?:string;
    services: IBookedServices[];
    deliveryDate: Date;
    venue: IAddress;
    totalCount: number;

    constructor() {
        this._id = ''
        this.userId = ''
        this.user = ''
        this.serviceId = ''
        // this.eventId = ''
        this.event= ''
        this.style = ''
        this.providerId = ''
        this.services = [];
        this.deliveryDate = new Date();
        this.venue = { building: '', street: '', city: '', district: '', state: '', pbNo: 0 };
        this.totalCount = 0;
    }
}

export interface IAddress {
    building: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pbNo: number;
}

export interface IBookedServices {
    // serviceId: string;
    providerId?: string;
    serviceName?:string;
    // providerName:string;
    choiceName:string;
    choiceType:string;
   choicePrice:string;
}

export class BookingSearchFilter {
    userName: string;
    isConfirmed?: string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;
    // isConfirmed?:boolean;

    constructor() {
        this.userName = ''
        // this.isConfirmed = ''
        this.pageNumber = '1'
        this.pageSize = '2'
        this.sortBy = ''
        this.sortOrder = 'asc'
    }
}