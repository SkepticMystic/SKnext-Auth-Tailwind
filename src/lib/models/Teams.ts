import type { OID, Timestamps } from "$lib/interfaces";
import mongoose, { Model } from "mongoose";

export type Team = {} & Timestamps;

const modelName = "Teams";

export const Teams: Model<OID<Team>> =
  mongoose.models[modelName] ||
  mongoose.model(
    modelName,
    new mongoose.Schema({}, { timestamps: true }),
    modelName,
  );
