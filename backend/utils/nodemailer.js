import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transport = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
    }
})