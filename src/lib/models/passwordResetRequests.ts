import { ONE_DAY } from "$lib/const";
import mongoose, { type Model } from "mongoose";

export interface PasswordResetRequest {
    _id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}

export const PasswordResetRequests: Model<PasswordResetRequest> = mongoose.models['password_reset_requests'] ||
    mongoose.model(
        "password_reset_requests",
        new mongoose.Schema({
            userId: {
                type: String,
                required: true,
                ref: 'user'
            },
            token: {
                type: String,
                required: true,
                default: () => crypto.randomUUID()
            },
            expiresAt: {
                type: Date,
                required: true,
                default: () => Date.now() + ONE_DAY
            },
        })
    );
