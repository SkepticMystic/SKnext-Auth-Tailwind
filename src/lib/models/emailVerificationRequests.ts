import mongoose, { type Model } from "mongoose";
import { ONE_DAY } from "$lib/const";

export interface EmailVerificationRequest {
    _id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}

const modelName = "EmailVerificationRequest";
export const EmailVerificationRequests: Model<EmailVerificationRequest> = mongoose.models[modelName] ||
    mongoose.model(
        modelName,
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
        }),
        modelName
    );

