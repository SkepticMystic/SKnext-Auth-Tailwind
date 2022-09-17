import { dev } from "$app/environment";
import { LUCIA_SECRET, MONGO_URI } from "$env/static/private";
import adapter from "@lucia-sveltekit/adapter-mongoose";
import lucia from "lucia-sveltekit";
import mongoose, { Model } from "mongoose";

export interface DBUser {
    _id: string;
    hashed_password: string;
    identifier_token: string;
    email: string;
    roles: string[];
}

const userSchema = new mongoose.Schema({
    _id: String,
    identifier_token: {
        type: String,
        unique: true,
        required: true,
    },
    hashed_password: String,
    email: String,
    roles: [String],
}, { _id: false })

export const User: Model<DBUser> = mongoose.models['user'] || mongoose.model(
    "user",
    userSchema
);

const refreshTokenSchema = new mongoose.Schema({
    refresh_token: String,
    user_id: String,
})

export const RefreshToken = mongoose.models['refresh_token'] || mongoose.model(
    "refresh_token",
    refreshTokenSchema
);

export const auth = lucia({
    adapter: adapter(mongoose, MONGO_URI),
    secret: LUCIA_SECRET,
    env: dev ? "DEV" : "PROD",
});