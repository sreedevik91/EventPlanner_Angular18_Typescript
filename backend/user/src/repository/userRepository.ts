import { DeleteResult } from "mongoose";
import { IUserDb, IUserRepository } from "../interfaces/userInterface";
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
        const user = await User.findOne({ email })
        return user
    }

    async getUserByUsername(username: string): Promise<IUserDb | null> {
        const user = await User.findOne({ username })
        return user
    }

    async getTotalUsers():Promise<number>{
        const usersCount = await User.find().countDocuments()
        return usersCount
    }


}

// export default new UserRepository()
