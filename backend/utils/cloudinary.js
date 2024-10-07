import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const getCloudinaryURL = async (fileUri) => {
    const cloudRes = await cloudinary.uploader.upload(fileUri.content);
    // return the cloudinary url to store in the db
    return cloudRes.url;
}

export {
    getCloudinaryURL
}