import { Router } from "express"
import { subscribeSubscription, verifyCheckoutSession, isSubscriptionActive } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js"

const paymentRouter = Router();

paymentRouter.post("/create-checkout-session", verifyJWT, subscribeSubscription)
paymentRouter.post("/verify-session", verifyJWT, verifyCheckoutSession)
paymentRouter.get("/check-subscription", verifyJWT, isSubscriptionActive)

export {
  paymentRouter
}