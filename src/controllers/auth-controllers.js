import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { APIResponse } from "../utils/apiResponse.js";
import { emailVerificationMailGenContent, sendEmail } from "../utils/mail.js";
import { APIError } from "../utils/apiError.js";

//the algorithm 
//1. take some data
//2. validate the data
//3. check if user exists or not
//4. save the new user - generate access and refresh tokens sendmail with email verification token
//5. user verification => email verification token
//6. send requests with access token in headers => verify access token => if valid allow access to protected resources otherwise send error respons

const generateAccesandRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error generating tokens");
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        throw new APIError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        throw new APIError(409, "User with the same email or username already exists");
    }

    const newUser = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    });

    const { unHashedToken, hashedToken, tokenExpiry } =
        newUser.generateTempToken();

    newUser.emailVerificationToken = hashedToken;
    newUser.emailVerificationTokenExpires = tokenExpiry;

    await newUser.save({ validateBeforeSave: false });

    await sendEmail({
        email: newUser?.email,
        subject: "Email Verification",
        mailGenContent: emailVerificationMailGenContent(newUser.username, `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`)
    })

    // const createdUser = await User.findById(newUser._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpires -passwordResetToken -passwordResetTokenExpires");

    // if (!createdUser) {
    //     return res
    //         .status(500)
    //         .json(new APIResponse(500, "Failed to create user"));
    // }

    return res
        .status(201)
        .json(new APIResponse(201, "User registered successfully", newUser));
});

export { registerUser as default }