import mongoose, { type Model } from "mongoose";
import { ONE_DAY } from "$lib/const";

export interface EmailVerificationRequest {
    _id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}

export const EmailVerificationRequests: Model<EmailVerificationRequest> = mongoose.models['email_verification_requests'] ||
    mongoose.model(
        "email_verification_requests",
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

