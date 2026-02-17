import { Router } from "express";
import {
  clapPost,
  createPost, deletePostById,
  fetchActivePosts, deleteAllUserPost,
  fetchAllPostOfUser, fetchPostByURL,
  fetchRecommendedPost
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";

const postRouter = Router()

postRouter.get("/", fetchActivePosts) //correct
postRouter.get("/post?url", fetchPostByURL) //correct
postRouter.post("/create-post", verifyJWT, createPost) //correct
postRouter.post("/delete-post", verifyJWT, deletePostById) //correct

postRouter.get("/all-posts", verifyJWT, fetchAllPostOfUser)

postRouter.post("/:id", verifyJWT, clapPost) //correct

postRouter.get("/recommended", verifyJWT, fetchRecommendedPost)

// will not be used 
// postRouter.get("/delete-all-posts", verifyJWT, deleteAllUserPost)

export {
  postRouter
}