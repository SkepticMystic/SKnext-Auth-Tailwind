import { MONGO_URI } from '$env/static/private';
import mongoose from "mongoose";
import { auth } from '$lib/auth/lucia';
import { handleHooks } from "@lucia-auth/sveltekit";

export const handle = handleHooks(auth);

try {
    await mongoose.connect(MONGO_URI, { autoIndex: false });
} catch (error) {
    console.log(error);
}
