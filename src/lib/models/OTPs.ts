import { auth } from "$lib/auth/lucia";
import mongoose from "mongoose";

export interface OTPBase {
    userId: string;
    token: string;
    expiresAt?: Date;
}

export interface EmailVerificationOTP extends OTPBase {
    kind: "email-verification";
}

export interface PasswordResetOTP extends OTPBase {
    kind: "password-reset";
}

export type OTP = EmailVerificationOTP | PasswordResetOTP;

const modelName = "OTPs";
export const OTPs = mongoose.model<OTP>(
    modelName,
    new mongoose.Schema({
        userId: {
            type: String,
            required: true,
            ref: "user",
        },
        token: {
            type: String,
            required: true,
            default: () => crypto.randomUUID(),
        },
        expiresAt: {
            type: Date,
        },
        kind: {
            type: String,
            required: true,
            enum: ["email-verification", "password-reset"],
        },
    }, { timestamps: true }),
    modelName
);


export const isOPTExpired = <T extends { expiresAt?: Date }>(otp: T) => {
    if (otp.expiresAt === undefined) return false;
    else return otp.expiresAt.getTime() < Date.now();
}

/**
 * Return an existing OTP if it exists and is not expired, or create a new one if it doesn't exist or is expired.
 */
export const getExistingOrNewOTP = async (options: {
    userId: string,
    kind: OTP["kind"],
    expiresAt?: Date,
}) => {
    const { userId, kind, expiresAt } = options;

    // Check if there is an existing OTP for that user of that kind
    const existing = await OTPs.findOne({ userId, kind }).exec();

    if (existing) {
        if (isOPTExpired(existing)) {
            console.log("Existing OTP expired, creating new one")
            const [newOTP, _removeOld] = await Promise.all([
                OTPs.create({ userId, kind, expiresAt }),
                existing.remove(),
            ]);

            return newOTP;
        } else {
            console.log("Existing OTP not expired, returning it")
            return existing;
        }
    } else {
        console.log("No existing OTP, creating new one")
        return OTPs.create({ userId, kind, expiresAt });
    }
}

/**
 * Given a token, and the kind of OTP, returns the user and the OTP if it exists and is not expired.
 * 
 * If the OTP is expired, it will be deleted if `deleteIfExpired` is true.
 * 
 * If the user is not found, the OTP will be deleted.
 */
export const validateOTP = async (token: string, kind: OTP["kind"]) => {
    const otp = await OTPs.findOne({ token, kind }).exec();
    if (!otp) {
        console.log("OTP not found")
        return { ok: <const>false };
    }

    if (isOPTExpired(otp)) {
        console.log("OTP expired")
        await otp.remove();
        return { ok: <const>false };
    }

    const user = await auth.getUser(otp.userId);
    if (!user) {
        console.log("User not found")
        await otp.remove();
        return { ok: <const>false };
    }

    return { ok: <const>true, user, otp };
}