import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { APIError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const authenticateUser = asyncHandler(async(req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if(!token){
        throw new APIError(401, "Unauthorized: No token provided");
    }

    try{
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken.userId).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpires");
        if(!user){
            throw new APIError(401, "Unauthorized: Invalid token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, "Unauthorized: Invalid token");
    }

})