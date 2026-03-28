import { validationResult } from "express-validator";
import { APIError } from "../utils/apiError.js";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));

    return next(new APIError(422, "Validation Error", extractedErrors));
}

