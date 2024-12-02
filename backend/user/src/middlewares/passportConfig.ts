import passport, { Profile } from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { config } from "dotenv";
import { IGoogleUser, LoginData } from "../interfaces/userInterface";
import { Request } from "express";

config()

passport.use(new Strategy({
    clientID: process.env.GOOGLE_ID!,
    clientSecret: process.env.GOOGLE_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    passReqToCallback: true
},
    (req:Request,accaccessToken:string, refreshToken, profile:Profile, done:VerifyCallback) => {
        console.log('google user profile: ',profile)
        // after google verification user data from google would be available in profile
        const user:LoginData={
            googleId:profile.id,
            name: profile.displayName,
            email:profile.emails?.[0].value!
        }
        done(null,user)
    }

))

passport.serializeUser((user, done) => { // storing user data in express-session storage
    done(null, user)
})

passport.deserializeUser((user: IGoogleUser, done) => { // retrieving user data
    if (user) {
        done(null, user);
    } else {
        done(null, null);
    }
});

export default passport