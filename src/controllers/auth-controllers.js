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

export const login = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    if ((!email && !username) || !password) {
        throw new APIError(400, "Email or username and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new APIError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new APIError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccesandRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpires -passwordResetToken -passwordResetTokenExpires");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(new APIResponse(200, "Login successful", { user: loggedInUser, accessToken, refreshToken }));
});

export const logout = asyncHandler(async (req, res) => {
    // const user = req.user;

    // user.refreshToken = null;
    // await user.save({ validateBeforeSave: false });

    // res.clearCookie("refreshToken");

    await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: "" } },
    { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(new APIResponse(200, "Logout successful"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new APIResponse(200, "Current user fetched successfully", req.user));
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new APIError(400, "Verification token is required");
    }

    let hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new APIError(400, "Invalid or expired verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new APIResponse(200, "Email verified successfully"));
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.isEmailVerified) {
        throw new APIError(400, "Email is already verified");
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTempToken();
    
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpires = tokenExpiry;

    await user.save({ validateBeforeSave: false });
    
    await sendEmail({
        email: user?.email,
        subject: "Email Verification",
        mailGenContent: emailVerificationMailGenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`)
    })

    return res
        .status(200)
        .json(new APIResponse(200, "Verification email resent successfully"));
});

export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!refreshToken) {
        throw new APIError(401, "Unauthorized: No refresh token provided");
    }

    const user = await User.findOne({ refreshToken });

    if (!user) {
        throw new APIError(401, "Unauthorized: Invalid refresh token");
    }

    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (decodedToken.userId !== user._id.toString()) {
            throw new APIError(401, "Unauthorized: Invalid refresh token");
        }
        
        const { accessToken, refreshToken: newRefreshToken } = await generateAccesandRefreshTokens(user._id);
        const options = {
            httpOnly: true,
            secure: true
        }

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpires -passwordResetToken -passwordResetTokenExpires");
        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(new APIResponse(200, "Tokens refreshed successfully", { user: loggedInUser, accessToken, refreshToken: newRefreshToken }));
    } catch (error) {
        throw new APIError(401, "Unauthorized: Invalid refresh token");
    }
});

export const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new APIError(404, "User with the provided email does not exist");
    }

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTempToken();

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpires = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
        email: user?.email,
        subject: "Password Reset Request",
        mailGenContent: passwordResetMailGenContent(user.username, `${process.env.PASSWORD_RESET_URL}/${unHashedToken}`)
    })

    return res
        .status(200)
        .json(new APIResponse(200, "Password reset email sent successfully"));
});

export const resetPassword = asyncHandler(async(req, res) => {
    const { resetToken } = res.params;
    const { newPassword } = res.body;

    let hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    const user = await User.findOne({
        passwordResetToken : hashedToken,
        passwordResetTokenExpires : {$gt: Date.now()}
    })

    if(!user){
        throw new APIError(489, "Token is invalid");
    }

    user.passwordResetToken = null
    user.passwordResetTokenExpires = null
    user.password = newPassword

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new APIResponse(200, "Password reset successful"));
});

export const changePassword = asyncHandler(async(req, res) => {
    const {oldPassowrd, newPassword} = req.body

    const user = await User.findById(user._id);

    const validOldPassword = user.isPasswordCorrect(oldPassword) 

    if(!validOldPassword){
        throw new APIError(400, "Invalid Old Password");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave : false});

    return res
        .status(200)
        .json(new APIResponse(200,{}, "Password Changed Successfully"))

}); 