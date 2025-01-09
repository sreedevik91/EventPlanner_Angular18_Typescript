export class Booking {
    _id: string;
    // userId: string;
    user: string;
    serviceId?: string;
    providerId?: string;
    eventId?: string;
    services: IBookedServices[];
    deliveryDate: Date;
    venue: IAddress;
    totalCount: number;

    constructor() {
        this._id = ''
        // this.userId = ''
        this.user = ''
        this.serviceId = undefined; // Explicitly undefined for optional properties
        this.eventId = undefined; // Explicitly undefined for optional properties
        this.providerId = undefined; // Explicitly undefined for optional properties
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
    // providerId: string;
    // serviceName:string;
    // providerName:string;
    choiceName:string;
    choiceType:string;
   choicePrice:string;
}

export class BookingSearchFilter {
    eventName: string;
    isActive: string;
    pageNumber: string;
    pageSize: string;
    sortBy: string;
    sortOrder: string;

    constructor() {
        this.eventName = ''
        this.isActive = ''
        this.pageNumber = '1'
        this.pageSize = '2'
        this.sortBy = ''
        this.sortOrder = 'asc'
    }
}