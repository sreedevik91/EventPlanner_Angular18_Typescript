import { DeleteResult, FilterQuery, QueryOptions } from "mongoose";
import { IUserDb, IUserRepository, IUsersData } from "../interfaces/userInterface";
import { IUser } from "../interfaces/userInterface";
import User from "../models/userSchema";
import BaseRepository from "./baseRepository";

// class UserRepository implements IUserRepository {

//     async deleteUser(id: string): Promise<DeleteResult> {
//         const deleteuser = await User.deleteOne({ _id: id })
//         return deleteuser
//     }

//     async getUserByEmail(email: string): Promise<IUserDb | null> {
//         const user = await User.findOne({ email })
//         return user
//     }

//     async getUserById(id: string): Promise<IUserDb | null> {
//         const user = await User.findOne({ _id: id })
//         return user
//     }

//     async getUserByUsername(username: string): Promise<IUserDb | null> {
//         const user = await User.findOne({ username })
//         return user
//     }

//     async createUser(userData: Partial<IUser>): Promise<IUserDb> {
//         const user = new User(userData)
//         return await user.save()
//     }

//     async getAllUsers(filter:any,sort:any,limit:number,skip:number): Promise<IUserDb[]> {
//         const users = await User.find(filter).sort(sort).limit(limit).skip(skip)
//         return users
//     }

//     async updateUser(id: string, data: Partial<IUser>): Promise<IUserDb | null> {
//         const updateUser = await User.findOneAndUpdate({ _id: id }, {$set:data},{new:true})
//         return updateUser
//     }

//     async getTotalUsers():Promise<number>{
//         const usersCount = await User.find().countDocuments()
//         return usersCount
//     }
// }

export class UserRepository extends BaseRepository<IUserDb> implements IUserRepository {
    
    constructor() {
        super(User)
    }

    async getUserByEmail(email: string): Promise<IUserDb | null> {
        const user = await this.model.findOne({ email })
        return user
    }

    async getUserByUsername(username: string): Promise<IUserDb | null> {
        const user = await this.model.findOne({ username })
        return user
    }

    async getTotalUsers():Promise<number>{
        const usersCount = await this.model.find().countDocuments()
        return usersCount
    }

    async getUsersAndCount(query:FilterQuery<IUser>={}, options:QueryOptions={}):Promise<IUsersData[]>{
        const {sort={},limit=0,skip=0}=options
        return await this.model.aggregate([
            {
                $facet:{
                    'users':[
                        {$match:query},
                        {$sort:sort},
                        {$skip:skip!},
                        {$limit:limit!}
                    ],
                    'usersCount':[
                        {$match:query},
                        {$count:'totalUsers'}
                    ]
                }
            }
        ])
    }

  

}

// export default new UserRepository()
