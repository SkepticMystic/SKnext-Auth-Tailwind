import { MONGO_URI } from '$env/static/private';
import { auth } from "$lib/auth/lucia";
import mongoose from "mongoose";

try {
    mongoose.connect(MONGO_URI, { autoIndex: false });
} catch (error) {
    console.log(error);
}

export const handle = auth.handleHooks();
