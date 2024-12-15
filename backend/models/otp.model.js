import mongoose from "mongoose";
// OTP schema and model
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

export const OTP = mongoose.model("OTP", otpSchema);
