import { Router } from "express";
import { registerUser, login, logout, getCurrentUser, verifyEmail, resendVerificationEmail, refreshToken, forgotPasswordRequest, resetPassword, changePassword } from "../controllers/auth-controllers.js";
import { validateRequest } from "../middlewares/validator.middleware.js";
import { registerValidationRules } from "../valid/index.js";
import { loginValidationRules } from "../valid/index.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { userChangePasswordValidationRules } from "../valid/index.js";
import { userForgotPasswordValidationRules } from "../valid/index.js";
import { userResetForgotPasswordValidator } from "../valid/index.js";
const router = Router();

//usecured routes
router.route("/register").post(registerValidationRules(), validateRequest, registerUser);
router.route("/login").post(loginValidationRules(), validateRequest, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshToken);
router.route("/forgot-password").post(userForgotPasswordValidationRules(), validateRequest, forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(), validateRequest, resetPassword);

//secured routes
router.route("/logout").post(authenticateUser, logout);
router.route("/current-user").post(authenticateUser, getCurrentUser);
router.route("/change-password").post(authenticateUser, userChangePasswordValidationRules(), validateRequest, changePassword);
router.route("/resend-email-verification").post(authenticateUser, resendVerificationEmail);

export default router;  