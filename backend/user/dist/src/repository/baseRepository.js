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
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    // private model: Model<T>
    constructor(model) {
        this.model = model;
        this.model = model;
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new this.model(userData);
            return yield user.save();
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // return await this.model.findOne({ _id: id })
            return yield this.model.findById(userId);
        });
    }
    // async getAllUsers(query: FilterQuery<T> = {}, options: { sort?: any, limit?: number, skip?: number } = {}): Promise<T[] | null> {
    //     const { sort, limit, skip } = options
    //     return await this.model.find(query).sort(sort).limit(limit!).skip(skip!)
    // }
    getAllUsers() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options = {}) {
            const { sort, limit, skip } = options;
            return yield this.model.find(query).sort(sort).limit(limit).skip(skip);
        });
    }
    updateUser(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.deleteOne({ _id: userId });
        });
    }
}
exports.default = BaseRepository;
