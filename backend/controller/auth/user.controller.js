import { User } from "../../models/user.model.js";
import { OTP } from "../../models/otp.model.js";
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { transport } from '../../utils/nodemailer.js'
import { generateRandomPassword } from "../../utils/randomPassword.js"

// Function to generate a 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Schema for input validation user registration 
const userSignUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    userId: z.string(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
});
// Email OTP authentication
export const userEmailVerification = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    // Generate OTP
    const otp = generateOtp();

    // Set expiration time (1 minute from now)
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

    try {

        await OTP.create({
            email, otp, expiresAt
        })
        const info = await transport.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'OTP Verification from GiggleChat',
            text: `Please use the following OTP for verification: ${otp}. This OTP is valid for 1 minute.`

        })

        if (!info.messageId) {
            res.json({
                success: false,
                message: "Invalid Email!"
            })
            return;
        }

        res.json({
            success: true,
            message: "OTP sent successfully! Please check your email."
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Internal Server error!"
        })
    }
}


// OTP Verification 
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const isValidOtp = await OTP.findOne({ email, otp });
        // console.log(isValidOtp);
        if (!isValidOtp) {
            res.json({
                success: false,
                message: "Invalid OTP"
            })
            return;
        }
        const password = generateRandomPassword(8);
        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = email.split('@')[0];

        const user = await User.create({ email,name, password: hashedPassword });

        await transport.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Temporary Password for GiggleChat',
            text: `Here is your temporary password, 
  Password: ${password}
  Please update your password for security purpose..!`,
            html: `
    <div>
      <p>Here is your temporary password,</p>
      <h3>Password: ${password}</h3>
      <p>Please update your password for security purpose..!</p>
    </div>
  `
        });

        res.json({
            success: true,
            message: "OTP Verified. Continue with registration.....",
            userId: user._id
        })

        await OTP.deleteOne({ email, otp });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Internal Server error!"
        })
    }
}
export const userSignUp = async (req, res) => {
    // Validate the request body with Zod (only name and password)
    const { name, userId, password } = userSignUpSchema.parse(req.body);

    try {
        // Find the user by userId (they should exist after email verification)
        const existingUser = await User.findById(userId);
        // console.log(existingUser);
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found. Please verify your email first."
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user with the new name and password
        existingUser.name = name;
        existingUser.password = hashedPassword;

        // Save the updated user
        await existingUser.save();

        // Return success response
        return res.status(200).json({
            message: "User Registered successfully.",
            user: {
                name: existingUser.name,
                email: existingUser.email
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            // If validation error from Zod, send the validation error messages
            console.error(error.errors);
            return res.status(400).json({
                message: "Validation failed.",
                errors: error.errors,  // Zod will give you an array of validation issues
            });
        }

        // General error handling
        console.error("Error during user update: ", error.message);
        return res.status(500).json({
            message: "Internal server error. Please try again later.",
        });
    }
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Successful sign-in 

        // Generate jwt token 
        const userToken = { userId: user._id };
        const token = jwt.sign(userToken, process.env.SECRET_KEY);
        // Set Cookie
        // console.log("Token: ", token)
        res.cookie('token', token, {
            secure: true,//use this when the code is in production for https cookie request
            httpOnly: true,
            sameSite: 'None',//dealing with cross-site requests and the usage of third-party cookies

            expires: new Date(Date.now() + 3600000 * 24) // 1 hour expiration
        });

        return res.status(200).json({
            message: "Sign-in successful.", user: {
                email: user.email,
                avatar: user.avatar,
                name: user.name,
                userId: user._id
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error." });
    }
};
export const userLogout = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');

    return res.status(200).json({ message: "Logout successful!" });
};

export const getUsers = async (req, res) => {
    const filter = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};
    try {
        // const users = (await User.find(filter))
        // .find({_id: {$ne: req.userId}});
        const users = await User.find({ ...filter, _id: { $ne: req.userId } }); // Moved _id filter inside find

        res.status(200).json({
            users
        })
    } catch (error) {
        console.log("Error..");
        res.status(500).json({
            error
        })
    }
}

