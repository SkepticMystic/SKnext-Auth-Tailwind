import { dev } from "$app/environment";
import adapter from "@lucia-auth/adapter-mongoose";
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import mongoose, { Model } from "mongoose";

export const Users: Model<Lucia.UserAttributes> =
  mongoose.models["auth_user"] ||
  mongoose.model(
    "auth_user",
    new mongoose.Schema(
      {
        _id: String,
        email: String,
        roles: [String],
        emailVerified: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
      { _id: false }
    )
  );

const Sessions: Model<Lucia.UserAttributes> =
  mongoose.models["auth_session"] ||
  mongoose.model(
    "auth_session",
    new mongoose.Schema(
      {
        _id: {
          type: String,
        },
        user_id: {
          type: String,
          required: true,
        },
        active_expires: {
          type: Number,
          required: true,
        },
        idle_expires: {
          type: Number,
          required: true,
        },
      },
      { _id: false }
    )
  );

const Keys: Model<Lucia.UserAttributes> =
  mongoose.models["auth_key"] ||
  mongoose.model(
    "auth_key",
    new mongoose.Schema(
      {
        _id: {
          type: String,
        },
        user_id: {
          type: String,
          required: true,
        },
        hashed_password: String,
        primary_key: {
          type: Boolean,
          required: true,
        },
        expires: {
          type: mongoose.Schema.Types.Mixed,
          default: null,
        },
      },
      { _id: false }
    )
  );

export const auth = lucia({
  adapter: adapter(mongoose),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  transformUserData: ({ id, email, emailVerified, roles }) => ({
    userId: id,
    email,
    roles,
    emailVerified,
  }),
});

export type Auth = typeof auth;
