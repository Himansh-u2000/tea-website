import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', err);

    // Handle ApiError (your custom errors)
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(new ApiResponse(err.statusCode, null, err.message));
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json(new ApiResponse(400, null, 'Validation Error', Object.values(err.errors).map(e => e.message)));

    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json(new ApiResponse(400, null, 'Duplicate field value entered'));
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(new ApiResponse(401, null, 'Invalid token'));
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json(new ApiResponse(401, null, 'Token expired'));
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'Token expired'
        });


    }
    // Default to 500 server error
    return res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));

}
export default errorHandler;