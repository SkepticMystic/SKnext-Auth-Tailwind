import { auth } from "$lib/auth/lucia";
import type { Action } from "@sveltejs/kit";

export const POST: Action = async ({ request, setHeaders }) => {
    const { email, password } = await request.json()
    if (!email || !password) return { errors: { validation: "Email and password are required" } };

    try {
        const { cookies } = await auth.authenticateUser(
            "email",
            email,
            password
        );

        setHeaders({ "set-cookie": cookies })
        return { location: "/" };
    } catch (e) {
        const { message } = e as Error;
        if (
            message === "AUTH_INVALID_IDENTIFIER_TOKEN" ||
            message === "AUTH_INVALID_PASSWORD"
        ) {
            return { errors: { invalid: "Invalid email or password" } };
        }

        return { errors: { message }, status: 500 };
    }
};