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
exports.ServiceRepository = void 0;
const serviceSchema_1 = __importDefault(require("../models/serviceSchema"));
const baseRepository_1 = require("./baseRepository");
// class ServiceRepository implements IServiceRepository{
//     async createService(serviceData: Partial<IService>): Promise<IService> {
//         const newService= new Service(serviceData)
//         return await newService.save()
//     }
//     async deleteService(id: string): Promise<DeleteResult> {
//         return await Service.deleteOne({_id:id})
//     }
//     async getAllServices(filter:any,sort:any,limit:number,skip:number): Promise<IService[]> {
//         return await Service.find(filter).sort(sort).limit(limit).skip(skip)
//     }
//     async getServiceById(id: string): Promise<IServiceDb | null> {
//         return await Service.findOne({_id:id})
//     }
//     async getTotalServices(): Promise<number> {
//         return await Service.find().countDocuments()
//     }
//     async updateService(id:string,serviceData: Partial<IService>): Promise<IServiceDb | null> {
//         return await Service.findOneAndUpdate({_id:id},{$set:serviceData},{new:true})
//     }
// }
class ServiceRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(serviceSchema_1.default);
    }
    getTotalServices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find().countDocuments();
        });
    }
    getServiceByProviderOld(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ provider: providerId });
        });
    }
    getAllServiceByEventName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await Service.find({ events: { $in: [name] } })
            return yield this.getAllServices({ events: { $in: [name] } });
        });
    }
    getServiceByProvider(name, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ name, provider: providerId });
        });
    }
    getAllServiceByProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllServices({ provider: id });
        });
    }
    getServiceByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = yield this.model.aggregate([
                { $match: { name: name } }, // check with isApproved:true,isActive:true as well after testing
                { $unwind: '$choices' },
                {
                    $project: {
                        name: '$name',
                        events: '$events',
                        choices: '$choices',
                        img: '$img'
                    }
                },
                { $unwind: '$events' },
                {
                    $group: {
                        _id: '$choices.choiceName',
                        maxPrice: { $max: '$choices.choicePrice' },
                        minPrice: { $min: '$choices.choicePrice' },
                        img: { $push: '$img' },
                        events: { $push: '$events' },
                        choicesType: { $push: '$choices.choiceType' },
                        choiceImg: { $push: '$choices.choiceImg' },
                        // choices:{$push:{choiceName:'$choices.choiceName',choiceType:'$choices.choiceType',choicePrice:'$choices.choicePrice',choiceImg:'$choices.choiceImg'}},
                    }
                }
            ]);
            return service;
        });
    }
    getServicesAndCount() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options = {}) {
            const { sort = {}, limit = 0, skip = 0 } = options;
            return yield this.model.aggregate([
                {
                    $facet: {
                        'services': [
                            { $match: query },
                            { $sort: sort },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        'servicesCount': [
                            { $match: query },
                            { $count: 'totalServices' }
                        ]
                    }
                }
            ]);
        });
    }
}
exports.ServiceRepository = ServiceRepository;
// export default new ServiceRepository()
