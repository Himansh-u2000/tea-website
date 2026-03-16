import { Router } from "express";
import {
  clapPost,
  createPost, deletePostById,
  fetchActivePosts, deleteAllUserPost,
  fetchAllPostOfUser, fetchPostByURL,
  fetchRecommendedPost, fetchPaginatedPost
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { verifySubscription } from "../middleware/verifySubscription.middleware.js";

const postRouter = Router()

postRouter.get("/", verifyJWT, verifySubscription, fetchPaginatedPost) //correct
postRouter.get("/post?url", verifyJWT, verifySubscription, fetchPostByURL) //correct
postRouter.post("/create-post", verifyJWT, verifySubscription, createPost) //correct
postRouter.post("/delete-post", verifyJWT, deletePostById) //correct

postRouter.get("/all-posts", verifyJWT, verifySubscription, fetchAllPostOfUser)

postRouter.post("/:id", verifyJWT, verifySubscription, clapPost) //correct

postRouter.get("/recommended", verifyJWT, verifySubscription, fetchRecommendedPost)

// will not be used 
// postRouter.get("/delete-all-posts", verifyJWT, deleteAllUserPost)

export {
  postRouter
}