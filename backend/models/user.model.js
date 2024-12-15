import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        // required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String, 
        trim: true,
        // required: true
    },
    avatar: {
        type: {
            url: String,
            localPath: String,
        },
        default: {
            url: `https://github.com/shadcn.png`,
            localPath: "",
        },
    }
},{timestamps: true})

export const User = mongoose.model("User",userSchema);

