import { auth } from "$lib/auth/lucia";
import type { Action } from "@sveltejs/kit";

export const POST: Action = async ({ request, setHeaders }) => {
    const { email, password } = await request.json()
    console.log(email, password)
    if (!email || !password) return { errors: { validation: "Email and password are required" } };

    try {
        const { cookies } = await auth.createUser("email", email, {
            password,
            user_data: { email },
        });

        setHeaders({ 'set-cookie': cookies })
        return { location: "/" }
    } catch (e) {
        const { message } = e as Error;
        if (
            message === "AUTH_DUPLICATE_IDENTIFIER_TOKEN" ||
            message === "AUTH_DUPLICATE_USER_DATA"
        ) {
            return { errors: { duplicate: "Email already exists" } };
        }
        return { errors: { message }, status: 500 };
    }
};