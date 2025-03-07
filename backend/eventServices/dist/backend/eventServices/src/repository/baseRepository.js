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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    createService(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new this.model(data);
            return yield service.save();
        });
    }
    getServiceById(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(serviceId);
        });
    }
    getAllServices() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options = {}) {
            const { sort, limit, skip } = options;
            return yield this.model.find(query).sort(sort).limit(limit).skip(skip);
        });
    }
    updateService(serviceId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ _id: serviceId }, { $set: data }, { new: true });
        });
    }
    deleteService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndDelete(serviceId);
        });
    }
}
exports.BaseRepository = BaseRepository;
