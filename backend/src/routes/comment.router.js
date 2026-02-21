import { Router } from "express";
import { clapComment, createComment, fetchComment, replyComment } from "../controllers/comment.controller.js";

const commentRouter = Router()

commentRouter.post("/create-comment", createComment);
commentRouter.patch("/clap-comment", clapComment)
commentRouter.patch("/reply-comment", replyComment)
commentRouter.get("/get-comments", fetchComment)
