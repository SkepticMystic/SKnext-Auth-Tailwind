import { dev } from "$app/environment";
import adapter from "@lucia-auth/adapter-mongoose";
import lucia, { generateRandomString } from "lucia-auth";
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

mongoose.model(
    "session",
    new mongoose.Schema(
        {
            _id: {
                type: String,
            },
            user_id: {
                type: String,
                required: true,
            },
            expires: {
                type: Number,
                required: true,
            },
            idle_expires: {
                type: Number,
                required: true,
            },
        },
        { _id: false }
    )
);

export const auth = lucia({
    adapter: adapter(mongoose),
    env: dev ? "DEV" : "PROD",
    generateCustomUserId: async () => generateRandomString(8),
    transformUserData: ({ id, email, emailVerified, roles }) => ({
        userId: id,
        email,
        roles,
        emailVerified,
    })
});

export type Auth = typeof auth;