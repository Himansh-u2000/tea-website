import { Router } from "express"
import { subscribeSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js"

const paymentRouter = Router();

paymentRouter.post("/create-checkout-session", verifyJWT, subscribeSubscription)
paymentRouter.get("/check-subscription", verifyJWT, subscribeSubscription)


export {
  paymentRouter
}