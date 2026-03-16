import AsyncHandler from "express-async-handler"
import { ApiResponse } from "../util/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../util/ApiError.js";
import { User } from "../models/user.model.js";
import { redisClient } from "../conf/index.js"
import geohash from "ngeohash";

/*
 Sanitize all the incoming data
*/
const createPost = AsyncHandler(async (req, res) => {
  const {
    title = "", content, thumbnail,
    isActive = true, images = [], createdBy,
    lat, lng, city, region
  } = req.body;

  if (!title || !content || !createdBy || [title, content, createdBy].some(f => f.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "title or content missing"));
  }

  const postUrl = title
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    const postData = {
      title: title.trim(),
      content,
      createdBy,
      isActive,
      postUrl,
      city,
      region
    };

    // ✅ ONLY add location if lat & lng exist
    if (lat != null && lng != null) {
      postData.location = {
        type: "Point",
        coordinates: [Number(lng), Number(lat)]
      };
      postData.locationPermission = true;
    }

    if (thumbnail) postData.thumbnail = thumbnail;
    if (images.length > 0) postData.images = images;

    const post = await Post.create(postData);

    return res
      .status(201)
      .json(new ApiResponse(201, post._id, "Post Created Successfully"));

  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error While Creating Post", error);
  }
});


const fetchActivePosts = AsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({ isActive: true }).populate("createdBy", "username");
    if (!posts) return res.status(404).json(new ApiResponse(404, null, "posts not found"))

    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})

const fetchPostByURL = AsyncHandler(async (req, res) => {
  console.log('id')
  const id = req.query.post;
  if (!id) return res.status(400).json(new ApiResponse(400, null, "post id not passed"))
  try {
    const posts = await Post.findOne({
      postUrl: id
    }).populate("createdBy", "username");
    if (!posts) return res.status(404).json(new ApiResponse(404, null, "error while fetching posts"))

    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})

const fetchAllPostOfUser = AsyncHandler(async (req, res) => {
  const userId = req.query.userId || req.user?._id;
  if (!userId) return res.status(400).json(new ApiResponse(400, null, "user id not passed"))
  try {
    const posts = await Post.find({ createdBy: userId }).populate("createdBy", "username");
    if (!posts) return res.status(404).json(new ApiResponse(404, null, "post not found"))

    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})

const fetchRecommendedPost = AsyncHandler(async (req, res) => {
  const { lat, lng, page = 1, limit = 10 } = req.query;
  if (!lat || !lng) return res.status(401).json(new ApiResponse(400, null, "lat and lng required"))
  // TODO: implement redis caching

  const geoHash = geohash.encode(lat, lng)
  const cacheKey = `posts:${geoHash}:${page}`;

  try {
    const cachedPosts = await redisClient.get(cacheKey);

    if (cachedPosts) {
      return res.status(200).json(new ApiResponse(200, JSON.parse(cachedPosts), "data fetched from cache"))
    }

  } catch (error) {
    throw new ApiError(500, "error while fetching posts from redis", error)
  }

  try {
    const totalCount = await Post.countDocuments({ isActive: true });
    const offset = (page - 1) * limit;

    const posts = await Post.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 10000
        }
      },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("createdBy", "username")
      .exec();

    const hasMore = totalCount > offset + limit;

    if (!posts) return res.status(404).json(new ApiResponse(404, null, "error in searching"))
    if (posts.length === 0) return res.status(200).json(new ApiResponse(200, { posts: [], hasMore: false, page }, ""));

    redisClient.set(cacheKey, JSON.stringify(posts))

    return res.status(200).json(new ApiResponse(200, { posts, hasMore, page }, "Posts fetched succesfully"))
  } catch (error) {
    throw new ApiError(500, "error while db query", error.text)
  }
})

const fetchPaginatedPost = AsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  try {
    const totalCount = await Post.countDocuments({ isActive: true });
    const posts = await Post.find({ isActive: true })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate("createdBy", "username")
      .exec()

    const hasMore = totalCount > offset + limit;

    if (!posts) return res.status(404).json(new ApiResponse(404, null, "error in searching"))
    if (posts.length === 0) return res.status(200).json(new ApiResponse(200, { posts: [], hasMore: false, page }, ""));

    return res.status(200).json(new ApiResponse(200, { posts, hasMore, page }, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})

const clapPost = AsyncHandler(async (req, res) => {
  // We have not given right to revoke unlike a post to user. 
  // if one user likes any post than it is permanent.
  const { userId } = req.body;
  const { id } = req.params;

  if (!userId || !id) {
    return res.status(400).json(new ApiResponse(400, null, "user id or post id missing"));
  }

  try {
    const cachedClaps = await redisClient.sIsMember(`clap:${id}`, userId);
    if (cachedClaps) {
      return res.status(200).json(new ApiResponse(200, null, "already liked"))
    } else {
      console.log("cached like", userId)
      await redisClient.SADD(`clap:${id}`, userId)
    }
  } catch (error) {
    throw new ApiError(500, "error in redis cache", error)
  }

  // try {
  //   const post = await Post.findById(id);

  //   if (!post) {
  //     return res.status(404).json(new ApiResponse(404, null, "Post not found"));
  //   }

  //   if (!post.clappedBy.includes(userId)) {
  //     post.clappedBy.push(userId);
  //     await post.save();
  //   }

  //   return res.status(200).json(new ApiResponse(200, post, "Post Liked Successfully"));
  // } catch (error) {
  //   throw new ApiError(500, "error while clapping post", error);
  // }
});

const deletePostById = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json(new ApiResponse(400, null, "post id not passed"))
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json(new ApiResponse(404, null, "post not found"))

    if (post.createdBy !== req.user.id) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"))

    const posts = await Post.findByIdAndDelete(id);
    if (!posts) return res.status(404).json(new ApiResponse(404, null, "post not found"))

    return res.status(200).json(new ApiResponse(200, null, "Posts Deleted Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})

// will not implement this. Will be feature
const deleteAllUserPost = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json(new ApiResponse(400, null, "post id not passed"))
  try {
    const posts = await Post.deleteMany({ createdBy: id });
    // if (posts.length === 0) return res.status(500).json(new ApiResponse(500, null, "error while fetching posts"))

    return res.status(200).json(new ApiResponse(200, null, "Posts Deleted Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})


export {
  createPost,
  clapPost,
  fetchPostByURL,
  fetchAllPostOfUser,
  fetchActivePosts,
  deletePostById,
  deleteAllUserPost,
  fetchRecommendedPost,
  fetchPaginatedPost
}