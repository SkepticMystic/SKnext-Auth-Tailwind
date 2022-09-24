import { ONE_DAY } from "$lib/const";
import mongoose, { type Model } from "mongoose";

export interface PasswordResetRequest {
    _id: string;
    user_id: string;
    token: string;
    expiresAt: Date;
}

export const PasswordResetRequests: Model<PasswordResetRequest> = mongoose.models['password_reset_requests'] ||
    mongoose.model(
        "password_reset_requests",
        new mongoose.Schema({
            user_id: {
                type: String,
                required: true
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
