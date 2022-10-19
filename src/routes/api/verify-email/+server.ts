import { auth } from "$lib/auth/lucia";
import { EmailVerificationRequests } from "$lib/models/emailVerificationRequests";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const token = url.searchParams.get("token");
    if (!token) throw error(400, "Missing token");

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
