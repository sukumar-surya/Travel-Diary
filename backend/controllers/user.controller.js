import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getUsers = async (req, res, next) => {
    const userId = req.user.id;

    const isValidUser = await User.findById(userId);

    if(!isValidUser) {
        return next(errorHandler(403, "You are not allowed to see all users"));
    }

    const {password: pass, ...others} = isValidUser._doc;

    res.status(200).json(others);
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("User signed out successfully");
    } catch (error) {
        next(error)
    }
}