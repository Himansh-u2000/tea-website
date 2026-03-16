import AsyncHandler from "express-async-handler";
import { redisClient } from "../conf/index.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../util/ApiError.js";

const syncClaps = AsyncHandler(async () => {
  // const totalClaps = await redisClient.keys("claps:*")
  try {
    const keys = await redisClient.keys("clap:*")

    if (keys.length === 0) return;

    const totalClapInCache = [];

    for (let key of keys) {
      // get all postid
      const postid = key.split(":")[1];

      // extract userId which like post 
      const userId = await redisClient.sMembers(key)
      // console.log("userId", userId)
      if (userId.length === 0) continue

      totalClapInCache.push({
        updateOne: {
          filter: { _id: postid },
          update: {
            $addToSet: {
              clappedBy: { $each: userId },
            },
          },
        },
      });
    }

    if (totalClapInCache.length > 0) {
      await Post.bulkWrite(totalClapInCache);
      console.log("DB write completed")
    }

    await redisClient.del(keys)
  } catch (error) {
    throw new ApiError(500, "error while syncing claps in cache and db", error)
  }
});

export { syncClaps };
