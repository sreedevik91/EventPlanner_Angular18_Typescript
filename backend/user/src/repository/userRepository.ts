import { DeleteResult } from "mongoose";
import { IUserDb, IUserRepository } from "../interfaces/userInterface";
import { IUser } from "../interfaces/userInterface";
import User from "../models/userSchema";

class UserRepository implements IUserRepository {

    async deleteUser(id: string): Promise<DeleteResult> {
        const deleteuser = await User.deleteOne({ _id: id })
        return deleteuser
    }

    async getUserByEmail(email: string): Promise<IUserDb | null> {
        const user = await User.findOne({ email })
        return user
    }

    async getUserById(id: string): Promise<IUserDb | null> {
        const user = await User.findOne({ _id: id })
        return user
    }

    async getUserByUsername(username: string): Promise<IUserDb | null> {
        const user = await User.findOne({ username })
        return user
    }

    async createUser(userData: Partial<IUser>): Promise<IUserDb> {
        const user = new User(userData)
        return await user.save()
    }

    async getAllUsers(): Promise<IUserDb[]> {
        const users = await User.find()
        return users
    }

    async updateUser(id: string, data: Partial<IUser>): Promise<IUserDb | null> {
        const updateUser = await User.findOneAndUpdate({ _id: id }, {$set:data})
        return updateUser
    }

}

export default new UserRepository()