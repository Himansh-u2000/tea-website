import AsyncHandler from "express-async-handler";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import { Post } from "../models/post.model.js";


// only for Admin Routes
const fetchAllPost = AsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find();
    if (posts.length < 1) return res.status(500).json(new ApiResponse(400, null, "error while fetching posts"))

    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})


export {
  fetchAllPost
}