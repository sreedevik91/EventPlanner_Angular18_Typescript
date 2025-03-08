"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const eventSchema_1 = __importDefault(require("../models/eventSchema"));
const baseRepository_1 = require("./baseRepository");
// class ServiceRepository implements IServiceRepository{
//     async createService(serviceData: Partial<IService>): Promise<IService> {
//         const newService= new Event(serviceData)
//         return await newService.save()
//     }
//     async deleteService(id: string): Promise<DeleteResult> {
//         return await Event.deleteOne({_id:id})
//     }
//     async getAllServices(filter:any,sort:any,limit:number,skip:number): Promise<IService[]> {
//         return await Event.find(filter).sort(sort).limit(limit).skip(skip)
//     }
//     async getServiceById(id: string): Promise<IServiceDb | null> {
//         return await Event.findOne({_id:id})
//     }
//     async getTotalServices(): Promise<number> {
//         return await Event.find().countDocuments()
//     }
//     async updateService(id:string,serviceData: Partial<IService>): Promise<IServiceDb | null> {
//         return await Event.findOneAndUpdate({_id:id},{$set:serviceData},{new:true})
//     }
// }
class EventRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(eventSchema_1.default);
    }
    getTotalEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            // return await Event.find().countDocuments()
            return yield this.model.find().countDocuments();
        });
    }
    getEventByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // let event =await Event.find({name})
            let event = yield this.getAllEvents({ name });
            // let event =await this.model.find({name})
            return event;
        });
    }
    getEventsAndCount() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options = {}) {
            const { sort = {}, limit = 0, skip = 0 } = options;
            return yield this.model.aggregate([
                {
                    $facet: {
                        'events': [
                            { $match: query },
                            { $sort: sort },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        'eventsCount': [
                            { $match: query },
                            { $count: 'totalEvents' }
                        ]
                    }
                }
            ]);
        });
    }
}
exports.EventRepository = EventRepository;
// export default new EventRepository()
