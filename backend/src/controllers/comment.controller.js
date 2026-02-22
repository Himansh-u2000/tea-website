import AsyncHandler from "express-async-handler";
import { ApiResponse } from "../util/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../util/ApiError.js";

const createComment = AsyncHandler(async (req, res) => {
  const { content, postId, userId } = req.body;

  if (!content || !postId || !userId) return res.status(400).json(new ApiResponse(400, null, "content postId or userId not present"))

  try {
    const comment = await Comment.create({ content, postId: postId, createdBy: userId })
    if (!comment) return res.status(400).json(new ApiResponse(400, null, "unable to create comment"))

    return res.status(201).json(new ApiResponse(201, comment, "message created successfully"))
  } catch (error) {
    throw new ApiError(500, "internal server error", error)
  }
})

const replyComment = AsyncHandler(async (req, res) => {
  const { content, commentId, userId } = req.body;

  if (!content || !commentId || !userId) return res.status(400).json(new ApiResponse(400, null, "content postId or userId not present"))

  try {
    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(400).json(new ApiResponse(400, null, "unable to create comment"))

    if (comment.createdBy.toString() !== userId.toString()) return res.status(400).json(new ApiResponse(400, null, "you are not authorized to reply to this comment"))

    const reply = await Comment.create({
      content,
      createdBy: userId,
      postId: comment.postId
    })

    if (!reply) return res.status(400).json(new ApiResponse(400, null, "unable to create reply"))

    comment.reply.push(reply._id)
    await comment.save()

    return res.status(201).json(new ApiResponse(201, comment, "message created successfully"))
  } catch (error) {
    throw new ApiError(500, "internal server error", error)
  }
})


const clapComment = AsyncHandler(async (req, res) => {
  const { commentId, userId } = req.body;

  if (!commentId) return res.status(400).json(new ApiResponse(400, null, "commentId not present"));

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json(new ApiResponse(404, null, "comment not present"));

    if (!comment.clappedBy.includes(userId)) {
      comment.clappedBy.push(userId);
      await comment.save();
    }

    return res.status(200).json(new ApiResponse(200, comment, "comment clapped successfully"));
  } catch (error) {
    throw new ApiError(500, "internal server error", error);
  }
});

const fetchComment = AsyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) return res.status(400).json(new ApiResponse(400, null, "postId not present"))

  try {
    const comments = await Comment.findById(postId).populate("createdBy", "username").populate("reply", "username")
    if (!comments) return res.status(404).json(new ApiResponse(404, null, "comments not present"))

    return res.status(200).json(new ApiResponse(200, comments, "comments fetched successfully"))
  } catch (error) {
    throw new ApiError(500, "internal server error", error)
  }
})

export {
  clapComment,
  createComment,
  replyComment,
  fetchComment
}