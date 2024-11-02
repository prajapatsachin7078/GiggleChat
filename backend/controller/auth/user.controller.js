import { User } from "../../models/user.model.js";
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
const userSignUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        }),
});
export const userSignUp = async (req, res) => {
    // console.log(req.body);
    try {
        // Validate the request body with Zod
        const { name, email, password } = userSignUpSchema.parse(req.body);
        const file = req.file;
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists! Try with a different email.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Handle file upload (avatar)

        // Return success response with the created user
        return res.status(201).json({
            message: "User created successfully."
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            // If validation error from Zod, send the validation error messages
            console.error(error.errors)
            return res.status(400).json({
                message: "Validation failed.",
                errors: error.errors,  // Zod will give you an array of validation issues
            });
        }

        // General error handling
        console.error("Error during sign-up: ", error.message);
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // Successful sign-in 

        // Generate jwt token 
        const userToken = { userId: user._id };
        const token = jwt.sign(userToken, process.env.SECRET_KEY);
        // Set Cookie
        console.log("Token: ",token)
        res.cookie('token', token, {
            secure: true,//use this when the code is in production for https cookie request
            httpOnly: true,
            sameSite: 'None',//dealing with cross-site requests and the usage of third-party cookies

            expires: new Date(Date.now() + 3600000 * 24) // 1 hour expiration
        });

        return res.status(200).json({ message: "Sign-in successful.", user: { 
            email: user.email,
            avatar: user.avatar,
            name: user.name,
            userId: user._id
        } });
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

