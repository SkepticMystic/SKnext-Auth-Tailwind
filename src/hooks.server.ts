import { MONGO_URI } from "$env/static/private";
import { auth } from "$lib/auth/lucia";
import type { Handle } from "@sveltejs/kit";
import mongoose from "mongoose";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.auth = auth.handleRequest(event);
  return await resolve(event);
};

try {
  await mongoose.connect(MONGO_URI, { autoIndex: false });
} catch (error) {
  console.log(error);
}
