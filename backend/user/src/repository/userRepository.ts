import { DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { IUserDb, IUserRepository, IUsersData } from "../interfaces/userInterface";
import { IUser } from "../interfaces/userInterface";
import User from "../models/userSchema";
import BaseRepository from "./baseRepository";

export class UserRepository extends BaseRepository<IUserDb> implements IUserRepository {

    constructor() {
        super(User)
    }

    async getUserByEmail(email: string): Promise<IUserDb | null> {
        try {
            const user = await this.model.findOne({ email })
            return user
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }
    }

    async getUserByUsername(username: string): Promise<IUserDb | null> {
        try {
            const user = await this.model.findOne({ username })
            return user
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }
    }

    async getTotalUsers(): Promise<number | null> {
        try {
            const usersCount = await this.model.find().countDocuments()
            return usersCount
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }
    }

    async getUsersAndCount(query: FilterQuery<IUser> = {}, options: QueryOptions = {}): Promise<IUsersData[] | null> {
        try {
            const { sort = {}, limit = 0, skip = 0 } = options
            return await this.model.aggregate([
                {
                    $facet: {
                        'users': [
                            { $match: query },
                            { $sort: sort },
                            { $skip: skip! },
                            { $limit: limit! }
                        ],
                        'usersCount': [
                            { $match: query },
                            { $count: 'totalUsers' }
                        ]
                    }
                }
            ])
        } catch (error: unknown) {
            error instanceof Error ? console.log('Error message from user BaseRepository: ', error.message) : console.log('Unknown error from user BaseRepository: ', error)
            return null
        }
    }



}

