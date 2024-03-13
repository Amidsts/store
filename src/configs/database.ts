import mongoose, { ConnectOptions } from "mongoose";

import appConfig from ".";

async function connectMongoDb(): Promise<void> {
  const options = {
    family: 4,
  } as ConnectOptions;

  try {
    await mongoose.connect(appConfig.mongoDbUri, options);
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database: " + error);
    process.exit(1);
  }
}

export default connectMongoDb;

export async function closeMongoDb(): Promise<void> {
  await mongoose.disconnect();

  console.log("Database disconnected");
}