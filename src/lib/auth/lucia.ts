import { dev } from "$app/environment";
import adapter from "@lucia-auth/adapter-mongoose";
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import mongoose, { Model } from "mongoose";
import { ROLES } from "./roles";

export const Users: Model<Lucia.UserAttributes> =
  mongoose.models["auth_user"] ||
  mongoose.model(
    "auth_user",
    new mongoose.Schema(
      {
        _id: String,
        email: {
          type: String,
          required: true,
        },
        team_id: {
          type: String,
          required: true,
          ref: "Teams",
        },
        role: {
          type: String,
          required: true,
          enum: ROLES,
        },
        emailVerified: {
          type: Boolean,
          required: true,
          default: false,
        },
        admin: {
          type: Boolean,
          default: false,
        },
      },
      { _id: false },
    ),
  );

const Sessions: Model<Lucia.UserAttributes> = mongoose.models["auth_session"] ||
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
      { _id: false },
    ),
  );

const Keys: Model<Lucia.UserAttributes> = mongoose.models["auth_key"] ||
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
      { _id: false },
    ),
  );

export const auth = lucia({
  adapter: adapter(mongoose),
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  transformDatabaseUser: (
    { id, email, emailVerified, team_id, role, admin },
  ) => ({
    userId: id,
    admin,
    email,
    emailVerified,
    role,
    team_id,
  }),
});

export type Auth = typeof auth;
