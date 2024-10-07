import jwt from 'jsonwebtoken';

export const validateUser = (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing.' });
        }

        // Verify the token and extract the payload (e.g., userId)
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // console.log(decoded)
        // Optionally, you can add the user ID to the request object for further use
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }

        // For other errors, return a 500 status
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
