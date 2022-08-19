import mongoose from "mongoose";
import { MONGO_URI } from "$lib/_env";

try {
    mongoose.connect(MONGO_URI, { autoIndex: false });
} catch (error) {

}