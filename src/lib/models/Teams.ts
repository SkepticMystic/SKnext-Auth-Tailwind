import mongoose from "mongoose";

const modelName = "Teams";
export const Teams = mongoose.models[modelName] ||
  mongoose.model(
    modelName,
    new mongoose.Schema(
      {},
      { timestamps: true },
    ),
    modelName,
  );
