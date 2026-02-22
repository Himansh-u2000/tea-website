import { Router } from "express";
import { changePassword, changeProfilePicture, verifyGender, getCurrentUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const userRouter = Router()

userRouter.patch("/change-password", verifyJWT, changePassword)
userRouter.patch("/change-profile-picture", verifyJWT, changeProfilePicture)
userRouter.post("/upload-id", verifyJWT, verifyGender)
userRouter.get("/me", verifyJWT, getCurrentUser)

export default userRouter;  