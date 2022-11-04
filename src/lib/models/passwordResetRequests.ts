import { ONE_DAY } from "$lib/const";
import mongoose, { type Model } from "mongoose";

export interface PasswordResetRequest {
    _id: string;
    userId: string;
    token: string;
    expiresAt: Date;
}

const modelName = "PasswordResetRequest";
export const PasswordResetRequests: Model<PasswordResetRequest> = mongoose.models[modelName] ||
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
