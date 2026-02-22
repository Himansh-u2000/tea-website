import { Router } from "express";
import { clapComment, createComment, fetchComment, replyComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const commentRouter = Router()

commentRouter.post("/", verifyJWT, createComment);
commentRouter.post("/clap", verifyJWT, clapComment);
commentRouter.post("/reply", verifyJWT, replyComment);
commentRouter.get("/:postId", verifyJWT, fetchComment);

export default commentRouter;
