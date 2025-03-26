import { DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { IEvent, IEventDb, IEventRepository, IEventsData } from "../interfaces/eventInterfaces";
import Event from "../models/eventSchema";
import { BaseRepository } from "./baseRepository";

export class EventRepository extends BaseRepository<IEvent> implements IEventRepository {

    constructor() {
        super(Event)
    }

    async getTotalEvents(): Promise<number | null> {
        try {
            return await this.model.find().countDocuments()
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event EventRepository: ', error.message) : console.log('Unknown error from chat EventRepository: ', error)
            return null
        }
    }

    async getEventByName(name: string): Promise<IEventDb[] | null> {
        try {
            let event = await this.getAllEvents({ name })
            return event
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event EventRepository: ', error.message) : console.log('Unknown error from chat EventRepository: ', error)
            return null
        }
    }

    async getEventsAndCount(query: FilterQuery<IEvent> = {}, options: QueryOptions = {}): Promise<IEventsData[] | null> {
        try {
            const { sort = {}, limit = 0, skip = 0 } = options
            return await this.model.aggregate([
                {
                    $facet: {
                        'events': [
                            { $match: query },
                            { $sort: sort },
                            { $skip: skip! },
                            { $limit: limit! }
                        ],
                        'eventsCount': [
                            { $match: query },
                            { $count: 'totalEvents' }
                        ]
                    }
                }
            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from event EventRepository: ', error.message) : console.log('Unknown error from chat EventRepository: ', error)
            return null
        }
    }

}
