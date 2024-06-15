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
import jwt from 'jsonwebtoken';

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


export const signin =  async (req, res, next) => {
    const{email , password } = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404, 'User not found!'));
        const validpassword = bcryptjs.compareSync(password, validUser.password);
        if (!validpassword) return next(errorHandler(401, 'Invalid Password'));
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const {password: pass, ...rest } = validUser._doc;
        res.cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);

    } catch (error) {
        next(error);
    }
};


export const google = async (req, res, next) => {

    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass,...rest} = user._doc;
            res 
            .cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest);
        }else{  
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase()+Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo 
            });
            await newUser.save();
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass,...rest} = user._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
    } catch (error) {
        next(error);
    }

};