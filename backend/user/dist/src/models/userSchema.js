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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        }
    },
    mobile: {
        type: Number,
        required: function () {
            return !this.googleId;
        }
    },
    googleId: {
        type: String,
        required: function () {
            return !this.password;
        }
    },
    otpData: {
        otp: {
            type: String,
            default: ''
        },
        expiresIn: {
            type: String,
            default: ''
        }
    },
    role: {
        type: String,
        enum: ['user', 'provider', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isUserVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(this);
        const user = this;
        // isModified will check if that particular field is modified or updated or added new
        if (user.password && user.isModified('password')) {
            try {
                const hashedPassword = yield bcryptjs_1.default.hash(user.password, yield bcryptjs_1.default.genSalt(10));
                this.password = hashedPassword;
            }
            catch (error) {
                next(error);
            }
        }
        next();
    });
});
const User = (0, mongoose_1.model)('user', UserSchema);
exports.default = User;
