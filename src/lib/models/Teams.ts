import mongoose, { Model } from "mongoose";

export interface Team {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const modelName = "Teams";
export const Teams: Model<Team> = mongoose.models[modelName] ||
  mongoose.model(
    modelName,
    new mongoose.Schema(
      {},
      { timestamps: true },
    ),
    modelName,
  );
