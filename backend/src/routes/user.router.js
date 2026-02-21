import { Router } from "express";
import { changePassword, changeProfilePicture } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const userRouter = Router()

userRouter.patch("/chang-password", verifyJWT, changePassword)
userRouter.patch("/chang-profile-picture", verifyJWT, changeProfilePicture)
userRouter.patch("/verify-gender", verifyJWT, changeProfilePicture)

export default userRouter;  