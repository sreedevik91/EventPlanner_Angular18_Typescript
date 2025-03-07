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
exports.UserRepository = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const baseRepository_1 = __importDefault(require("./baseRepository"));
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
class UserRepository extends baseRepository_1.default {
    constructor() {
        super(userSchema_1.default);
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({ email });
            return user;
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({ username });
            return user;
        });
    }
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersCount = yield this.model.find().countDocuments();
            return usersCount;
        });
    }
    getUsersAndCount() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options = {}) {
            const { sort = {}, limit = 0, skip = 0 } = options;
            return yield this.model.aggregate([
                {
                    $facet: {
                        'users': [
                            { $match: query },
                            { $sort: sort },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        'usersCount': [
                            { $match: query },
                            { $count: 'totalUsers' }
                        ]
                    }
                }
            ]);
        });
    }
}
exports.UserRepository = UserRepository;
// export default new UserRepository()
