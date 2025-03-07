"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, (req, accaccessToken, refreshToken, profile, done) => {
    var _a;
    console.log('google user profile: ', profile);
    // after google verification user data from google would be available in profile
    const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value
    };
    done(null, user);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    if (user) {
        done(null, user);
    }
    else {
        done(null, null);
    }
});
exports.default = passport_1.default;
