import AsyncHandler from "express-async-handler";
import { ApiResponse } from "../util/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../util/ApiError.js";
import { Subscription } from "../models/subscription.model.js";
import Stripe from "stripe"
import { FRONTEND_URL, STRIPE_SECRETKEY } from "../conf/index.js"

const isSubscriptionActive = AsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json(new ApiResponse(400, null, "user id is necessary"))
  // if (userId !== req.user._id) return res.status(401).json(new ApiResponse(401, null, "unauthorized"))
  try {
    const existingUser = await User.findById(userId);

    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"))

    return res.status(200).json(new ApiResponse(200, { existingUser, isActive: existingUser.subscription.isActive }, "data fetch successfully"))
  } catch (error) {
    throw new ApiError(500, "error while checking subscription", error)
  }
})


// not implemented
const subscribeSubscription = AsyncHandler(async (req, res) => {
  const { userId, priceId } = req.body;
  if (!userId) return res.status(400).json(new ApiResponse(400, null, "user id is required"))

  if (req.user._id !== userId) return res.status(401).json(new ApiResponse(401, null, "user unauthorized"))

  try {
    const existingUser = await User.findById(userId).populate("subscription");
    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"))

    // call stript to integrate payment
    // const price = 10;
    if (!priceId) return res.status(400).json(new ApiResponse(400, null, "price id is neccessary"))

    // console.log(`stripe secret key : ${STRIPE_SECRETKEY} and ${priceId}`)

    if (existingUser.subscription?.isActive) {
      return res.status(400).json(new ApiResponse(400, null, "user already subscribed"))
    }

    if (existingUser.subscription?.endDate > Date.now()) {
      return res.status(400).json(new ApiResponse(400, null, "user already subscribed"))
    }
    const stripe = new Stripe(STRIPE_SECRETKEY)
    const response = await stripe.checkout.sessions.create({
      // ui_mode: "custom",
      mode: 'subscription',
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1T3HcE5VgY9ysS7wPFzt7LGU",
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
      subscription_data: {
        billing_mode: { type: 'flexible' }
      }
    })

    return res.status(200).json(new ApiResponse(200, { payment_details: response }, "checkout session created successfully"))
  } catch (error) {
    throw new ApiError(500, "error while creating checkout session", error)
  }
})

const verifyCheckoutSession = AsyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json(new ApiResponse(400, null, "session id is required"));

  try {
    const stripe = new Stripe(STRIPE_SECRETKEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json(new ApiResponse(400, null, "Payment not completed"));
    }

    const existingUser = await User.findById(req.user._id).populate("subscription");
    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"));

    if (existingUser.subscription?.isActive && existingUser.subscription?.endDate > Date.now()) {
      return res.status(200).json(new ApiResponse(200, existingUser, "User already subscribed"));
    }

    const now = new Date();
    const subscription = await Subscription.create({
      userId: req.user._id,
      isActive: true,
      price: 10,
      startDate: now.getTime(),
      endDate: now.getTime() + 30 * 24 * 60 * 60 * 1000,
    });

    existingUser.subscription = subscription._id;
    await existingUser.save();

    return res.status(200).json(new ApiResponse(200, existingUser, "Subscription activated successfully"));
  } catch (error) {
    throw new ApiError(500, "error verifying session", error);
  }
});

export {
  subscribeSubscription,
  isSubscriptionActive,
  verifyCheckoutSession
}