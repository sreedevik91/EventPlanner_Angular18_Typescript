import { DeleteResult, FilterQuery, PipelineStage, QueryOptions } from "mongoose";
import { IAggregateResponse, IService, IServiceDb, IServiceRepository, IServicesData } from "../interfaces/serviceInterfaces";
import Service from "../models/serviceSchema";
import { BaseRepository } from "./baseRepository";

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

export class ServiceRepository extends BaseRepository<IService> implements IServiceRepository {

    constructor() {
        super(Service)
    }

    async getTotalServices(): Promise<number | null> {
        try {
            return await this.model.find().countDocuments()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

    async getServiceByProviderOld(providerId: string): Promise<IService | null> {
        try {
            return await this.model.findOne({ provider: providerId })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

    async getAllServiceByEventName(name: string): Promise<IService[] | null> {
        try {
            // return await Service.find({ events: { $in: [name] } })
            return await this.getAllServices({ events: { $in: [name] } })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

    async getServiceByProvider(name: string, providerId: string): Promise<IService | null> {
        try {
            return await this.model.findOne({ name, provider: providerId })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

    async getAllServiceByProvider(id: string): Promise<IService[] | null> {
        try {
            return await this.getAllServices({ provider: id })
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

    async getServiceByName(name: string): Promise<IAggregateResponse[] | null> {
        try {
            let service = await this.model.aggregate([
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

            ])

            return service
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

    async getServicesAndCount(query: FilterQuery<IService> = {}, options: QueryOptions = {}): Promise<IServicesData[] | null> {
        try {
            const { sort = {}, limit = 0, skip = 0 } = options
            console.log('sort from getServicesAndCount repository: ', sort);
            console.log('limit from getServicesAndCount repository: ', limit);
            console.log('skip from getServicesAndCount repository: ', skip);

            const aggregatePipeline: any[] = [
                { $match: query },
                { $sort: sort },
                { $skip: skip },
            ]

            if (limit !== undefined && limit > 0) {
                aggregatePipeline.push({ $limit: limit })
            }

            return await this.model.aggregate([
                {
                    $facet: {
                        // 'services':[
                        //     {$match:query},
                        //     {$sort:sort},
                        //     {$skip:skip},
                        //     {$limit:limit}
                        // ],
                        'services': aggregatePipeline,
                        'servicesCount': [
                            { $match: query },
                            { $count: 'totalServices' }
                        ]
                    }
                }
            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from service ServiceRepository: ', error.message) : console.log('Unknown error from service ServiceRepository: ', error)
            return null
        }

    }

}

// export default new ServiceRepository()