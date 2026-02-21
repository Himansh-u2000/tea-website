import { Router } from "express"
import { createUser, login, oAuthLogin } from "../controllers/auth.controller.js";

const authRouter = Router()

authRouter.post("/create-user", createUser)
authRouter.post("/login", login)
authRouter.post("/oauth-login", oAuthLogin)

export default authRouter;  