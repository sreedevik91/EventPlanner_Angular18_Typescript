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
    createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new this.model(data);
            return yield event.save();
        });
    }
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findById(id);
        });
    }
    getAllEvents() {
        return __awaiter(this, arguments, void 0, function* (query = {}, options = {}) {
            const { sort = {}, limit = 0, skip = 0 } = options;
            return yield this.model.find(query).sort(sort).limit(limit).skip(skip);
        });
    }
    updateEvent(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateQuery = {};
            if (data.$push) {
                updateQuery.$push = data.$push;
            }
            if (data.$set) {
                updateQuery.$set = data.$set;
            }
            // return await this.model.findOneAndUpdate({_id:id},{$set:data},{new:true})
            return yield this.model.findOneAndUpdate({ _id: id }, updateQuery, { new: true });
        });
    }
    deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findByIdAndDelete(id);
        });
    }
}
exports.BaseRepository = BaseRepository;
