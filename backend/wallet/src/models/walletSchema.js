"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactions: [{
            type: {
                type: String,
                required: true,
                enum: ['credit', 'debit']
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now()
            }
        }]
}, {
    timestamps: true
});
const Event = (0, mongoose_1.model)('wallet', WalletSchema);
exports.default = Event;
