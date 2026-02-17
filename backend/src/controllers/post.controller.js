import AsyncHandler from "express-async-handler"
import { ApiResponse } from "../util/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../util/ApiError.js";
import { User } from "../models/user.model.js";

/*
 Sanitize all the incoming data
*/
const createPost = AsyncHandler(async (req, res) => {
  const {
    title = "",
    content,
    thumbnail,
    isActive = true,
    images = [],
    createdBy,
    lat,
    lng,
    city,
    region
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
    const posts = await Post.find({ isActive: true });
    if (posts.length < 1) return res.status(500).json(new ApiResponse(400, null, "error while fetching posts"))

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
    });
    if (posts.length < 1) return res.status(500).json(new ApiResponse(400, null, "error while fetching posts"))

    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})

const fetchAllPostOfUser = AsyncHandler(async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json(new ApiResponse(400, null, "user id not passed"))
  try {
    const posts = await Post.find({ createdBy: userId });
    if (posts.length < 1) return res.status(404).json(new ApiResponse(404, null, "post not found"))

    return res.status(200).json(new ApiResponse(200, posts, "Posts Fetched Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while fetching posts", error)
  }
})


// fix
const fetchRecommendedPost = AsyncHandler(async (req, res) => {
  // will use geospacial field 
  const { lat, lng } = req.body;

  if (!lat || !lng) return res.status(401).json(new ApiResponse(400, null, "lat and lng required"))
  try {
    // const posts = await Post.aggregate([
    //   {
    //     $geoNear: {
    //       near: {
    //         type: "point", coordinates: [lat, lng],
    //       },
    //       distanceField: "dist.calculated",
    //       // minDistance: 0,
    //       // maxDistance: 10000,
    //       includeLocs: "dist.location",
    //       spherical: true
    //     }
    //   }
    // ])

    const posts = await Post.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat]
          },
          $maxDistance: 10000
        }
      }
    })

    if (posts.length < 0) return res.status(404).json(new ApiResponse(404, null, "No Posts Found or Error in Searching"));

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched succesfully"))
  } catch (error) {
    throw new ApiError(500, "error while db query", error.text)
  }
})

const clapPost = AsyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (!userId || !id) {
    return res.status(400).json(new ApiResponse(400, null, "user id or post id missing"))
  }

  try {
    // clap is now 1 but after redis we will use cached clap.
    // it increases clap any number of time which is bad but good that it pushed user id only one time.

    const post = await Post.findOneAndUpdate({ postUrl: id }, {
      $inc: { clap: 1 },
      $addToSet: { clappedBy: userId },
    }, { new: true })

    if (!post) return res.status(404).json(new ApiResponse(404, null, "No Posts"))
    return res.status(200).json(new ApiResponse(200, post, "Post Liked Successfully"))
  } catch (error) {
    throw new ApiError(500, "error while clapping post", error)
  }
})

const deletePostById = AsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json(new ApiResponse(400, null, "post id not passed"))
  try {
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
  fetchRecommendedPost
}