import { dev } from "$app/environment";
import { MONGO_URI } from "$env/static/private";
import adapter from "@lucia-sveltekit/adapter-mongoose";
import lucia, { generateRandomString } from "lucia-sveltekit";
import mongoose, { Model } from "mongoose";

export interface DBUser {
    _id: string;
    hashed_password: string;
    provider_id: string;
    email: string;
    roles: string[];
    emailVerified: boolean;
}

export const User: Model<DBUser> = mongoose.models['user'] ||
    mongoose.model(
        "user",
        new mongoose.Schema({
            _id: String,
            provider_id: {
                type: String,
                unique: true,
                required: true,
            },
            hashed_password: String,
            email: String,
            roles: [String],
            emailVerified: {
                type: Boolean,
                required: true,
                default: false
            },
        }, { _id: false })
    );


const RefreshToken = mongoose.model(
    "refresh_token",
    new mongoose.Schema({
        refresh_token: {
            unique: true,
            required: true,
            type: String,
        },
        user_id: {
            required: true,
            type: String,
        },
    })
);

const Session = mongoose.model(
    "session",
    new mongoose.Schema({
        access_token: {
            type: String,
            unique: true,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        expires: {
            type: Number,
            required: true,
        },
    })
);

export const auth = lucia({
    adapter: adapter(mongoose, MONGO_URI),
    env: dev ? "DEV" : "PROD",
    generateCustomUserId: async () => generateRandomString(8),
});