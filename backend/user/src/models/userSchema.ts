import mongoose, { CallbackError, Error, Schema } from "mongoose";

import bcrypt from 'bcryptjs';
import { IUser } from "../interfaces/userInterface";

const UserSchema:Schema<IUser> = new Schema({
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
            return !this.googleId
        }
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId
        }
    },
    mobile: {
        type: Number,
        required: function () {
            return !this.googleId
        }
    },
    googleId: {
        type: String,
        required: function () {
            return !this.password
        }
    },
    otpData: {
        otp: {
            type: String,
            default:''
        },
        expiresIn: {
            type: String,
            default:''
        }
    },
    role: {
        type: String,
        enum: ['user', 'provider', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'active'
    },

},
    {
        timestamps: true
    }
)


UserSchema.pre<IUser>('save', async function (next) {

    // console.log(this);
    const user = this
    // isModified will check if that particular field is modified or updated or added new
    if (user.password && user.isModified('password')) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, await bcrypt.genSalt(10))
            this.password = hashedPassword
        } catch (error) {
            next(error as mongoose.CallbackError)
        }
    }

    next()

})

const User = mongoose.model<IUser>('user', UserSchema)
export default User