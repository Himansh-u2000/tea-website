import AsyncHandler from "express-async-handler";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";

const verifySubscription = AsyncHandler(async (req, res, next) => {
    // Requires verifyJWT to run before this so req.user exists
    const userId = req.user._id;

    const user = await User.findById(userId).populate('subscription');

    if (!user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    if (user.gender === 'female') {
        // Female users just need to be verified
        if (user.status === 'verified') {
            return next();
        } else {
            return res.status(403).json(new ApiResponse(403, { code: 'GENDER_UNVERIFIED' }, "Access denied. Please verify your identity first."));
        }
    } else if (user.gender === 'male') {
        if (user.subscription && user.subscription.isActive) {
            // Further date check to ensure it hasn't expired
            const now = new Date();
            const endDateStr = user.subscription.endDate;
            const parsedEndDate = isNaN(Number(endDateStr)) ? endDateStr : Number(endDateStr);
            const endDate = new Date(parsedEndDate);

            if (endDate > now) {
                return next();
            } else {
                user.subscription.isActive = false;
                await user.subscription.save();
                return res.status(402).json(new ApiResponse(402, { code: 'SUBSCRIPTION_EXPIRED' }, "Subscription expired. Please renew to continue."));
            }
        } else {
            return res.status(402).json(new ApiResponse(402, { code: 'SUBSCRIPTION_REQUIRED' }, "Access denied. A premium subscription is required for male users."));
        }
    }

    // Fallback if gender is missing or invalid
    return res.status(403).json(new ApiResponse(403, null, "Invalid account configuration."));
});

export { verifySubscription };
