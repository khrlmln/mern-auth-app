import mongoose from "mongoose";
import { DB_URL } from "./env.js";

const connectToDB = async () => {
  await mongoose.connect(DB_URL);
  console.log("database connected successfully");
};

export default connectToDB;
