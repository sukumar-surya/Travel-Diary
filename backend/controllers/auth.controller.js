import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return next(errorHandler(409, "User already exists with this email"));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save();

        res.json("signup successful");
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => { 
    const { email, password } = req.body;

    if(!email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return next(errorHandler(400, "Invalid credentials"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        
        const { password: pass, ...others } = user._doc;

        res.cookie("access_token", token, {httpOnly: true, secure: true, sameSite: "none"}).status(200).json(others);
        } catch (error) {
            next(error)
    }
}


    
        