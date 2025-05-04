import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/auth/user.model.js";

export const protect = asyncHandler (async (req, res, next) => {
    console.log(req.cookies)
    try {
        
        // check if user is loggedin
        const token = req.cookies.token;
        
        if(!token){
            res.status(401).json({
                message: "not authorized, please login"
            })
        };

        // verify the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

       
        // get user detail from token --> exclude password
        const user = await User.findById(decoded.id).select("-password");

        // check if user exists
        if(!user){
            res.status(404).json({
                message: "user not found"
            })
        };

        // set user detail in request object

        req.user = user;

        next();
        
    } catch (error) {
        res.status(401).json({message: "Not authorized, token failed"});
    }
})