import mongoose from "mongoose";
import logger from "../utils/logger.js";
import dotenv from 'dotenv';
dotenv.config();
/** @type {typeof mongoose | undefined} */
export let dbInstance = undefined;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGO_URI
        );
        dbInstance = connectionInstance;
        logger.info(
            `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
        );
    } catch (error) {
        logger.error("MongoDB connection error: ", error);
        process.exit(1);
    }
};

export default connectDB;
