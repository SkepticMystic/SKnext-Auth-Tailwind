import * as db from '$lib/db'
import mongoose from "mongoose";
import lucia from "lucia-sveltekit";
import adapter from "@lucia-sveltekit/adapter-mongoose";
import { dev } from "$app/env";
import { LUCIA_SECRET, MONGO_URI } from "$lib/_env";

export interface DBUser {
    _id: string;
    hashed_password: string;
    identifier_token: string;
    email: string;
}

export const User = mongoose.model<DBUser>(
    "user",
    new mongoose.Schema(
        {
            _id: String,
            identifier_token: {
                type: String,
                unique: true,
                required: true,
            },
            hashed_password: String,
        },
        { _id: false, strict: false }
    )
);

export const RefreshToken = mongoose.model(
    "refresh_token",
    new mongoose.Schema({
        refresh_token: String,
        user_id: String,
    })
);

export const auth = lucia({
    adapter: adapter(mongoose, MONGO_URI),
    secret: LUCIA_SECRET,
    env: dev ? "DEV" : "PROD",
});