import { body } from "express-validator";

export const registerValidationRules = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email format"),
        body("username")
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
            .isLowercase().withMessage("Username must be in lowercase"),
        body("password")
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    ];
}

export const loginValidationRules = () => {
    return [
        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Invalid email format"),
        body("password")
            .notEmpty().withMessage("Password is required")
    ];
}

export const userChangePasswordValidationRules = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old Password is required"),
        body("newPassword").notEmpty().withMessage("New Password is required"),
    ]
};

export const userForgotPasswordValidationRules = () => {
    return [
        body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Enter correct email")
    ]
};

export const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword").notEmpty().withMessage("New Password is required")
    ]
};