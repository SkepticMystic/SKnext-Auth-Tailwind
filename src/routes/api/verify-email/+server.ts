import { auth } from "$lib/auth/lucia";
import { EmailVerificationRequests } from "$lib/models/emailVerifications";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
    const token = url.searchParams.get("token");
    if (!token) throw error(400, "Missing token");

    const verificationRequest = await EmailVerificationRequests.findOne({ token }).exec();
    if (!verificationRequest) throw error(400, "Invalid token");
    const { user_id, expiresAt } = verificationRequest;

    if (expiresAt < new Date()) throw error(400, "Token expired");

    const user = await auth.getUserById(user_id);
    if (!user) throw error(400, "Invalid token");
    await auth.updateUserData(user_id, {
        emailVerified: true,
    });

    await verificationRequest.remove();

    throw redirect(302, "/");
}
