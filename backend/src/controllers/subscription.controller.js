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
  // if (userId !== req._id) return res.status(401).json(new ApiResponse(401, null, "unauthorized"))
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
  const { userId, productId } = req.body;
  if (!userId) return res.status(400).json(new ApiResponse(400, null, "user id is required"))

  if (req._id !== userId) return res.status(401).json(new ApiResponse(401, null, "user unauthorized"))

  try {
    const existingUser = await User.findById(userId)
    if (!existingUser) return res.status(404).json(new ApiResponse(404, null, "user not found"))

    // call stript to integrate payment
    const price = 10;
    if (!productId) return res.status(400).json(new ApiResponse(400, null, "product id is neccessary"))

    const stripe = new Stripe(STRIPE_SECRETKEY)
    const response = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: productId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${FRONTEND_URL}/complete?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
    })

    console.log(response)

    if (!response.payment_status) return res.status(402).json(new ApiResponse(402, response, "payment required"))
    const now = new Date()
    const subscription = await Subscription.create({
      userId: userId,
      isActive: true,
      price: price,
      startDate: now.getTime(),
      endDate: now.getTime() + 30 * 24 * 60 * 60 * 1000,
    })

    return res.status(201).json(new ApiResponse(201, { payment_details: response, subscription }, "subscriation created successfully"))
  } catch (error) {
    throw new ApiError(500, "error while creating subscription", error)
  }
})

export {
  subscribeSubscription,
  isSubscriptionActive
}