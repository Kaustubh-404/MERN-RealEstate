// import User from "../models/user.model.js";
// import bcryptjs from "bcryptjs";
// import { errorHandler } from "../utils/error.js";

// export const signup = async (req, res, next) => {
//     const {username, email, password } = req.body;
//     const hashedPassword = bcryptjs.hashSync(password, 10);
//     const newUser = new User({username, email, password: hashedPassword });
//     try {
//         await newUser.save();
//         res.status(201).json('user created succesfully!')
        
//     } catch (error) {
//         next(error);
//     }
// };

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    try {
        // Log the incoming request body for debugging
        console.log('Received request body:', req.body);

        // Extract fields from the request body
        const { username, email, password } = req.body;

        // Validate that all required fields are present
        if (!username || !email || !password) {
            throw new Error('Username, email, and password are required');
        }

        // Log the password to check if it is defined
        //console.log('Password received:', password);

        // Hash the password using bcryptjs
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Create a new user instance
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save the new user to the database
        await newUser.save();

        // Send a success response
        res.status(201).json('User created successfully!');
    } catch (error) {
        console.error('Error in signup:', error);
        next(error); // Pass the error to the error handling middleware
    }
};
