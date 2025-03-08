"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    // services: [{
    //   service:{
    //     type: String,
    //   required: true
    //   },
    //   providerId:{
    //     type: String,
    //   required: true
    //   }
    // }],
    services: [{
            type: String,
            required: true
        }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Event = (0, mongoose_1.model)('event', EventSchema);
exports.default = Event;
