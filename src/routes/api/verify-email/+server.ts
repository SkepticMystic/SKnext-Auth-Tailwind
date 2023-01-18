import { auth } from "$lib/auth/lucia";
import { EmailVerificationRequests } from "$lib/models/emailVerificationRequests";
import { Parsers } from "$lib/schema/parsers";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const GET: RequestHandler = async ({ url }) => {
    const { token } = Parsers.params(url, z.object({ token: z.string() }));

    const verificationRequest = await EmailVerificationRequests.findOne({ token }).exec();
    if (!verificationRequest) throw error(400, "Invalid token");
    const { userId, expiresAt } = verificationRequest;

    if (expiresAt < new Date()) throw error(400, "Token expired");

    const user = await auth.getUser(userId);
    if (!user) throw error(400, "Invalid token");

    await auth.updateUserAttributes(userId, {
        emailVerified: true,
    });

    await verificationRequest.remove();

    throw redirect(302, "/");
}
