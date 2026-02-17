import { Router } from "express"
import { createUser, login } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/create-user", createUser)
authRouter.post("/login", login)
export default authRouter;  